import * as d3 from 'd3';

// file path: src/components/ecommerce/charts/D3LineChart.tsx
import React, { useEffect, useRef } from 'react';

import { NOLK_COLORS } from '@/constants/colors';

interface ChartDataPoint extends Record<string, string | number> {
  [key: string]: string | number;
}

interface D3LineChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKey: string;
  valueFormat?: (value: number) => string;
  width?: number;
  height?: number;
}

export const D3LineChart: React.FC<D3LineChartProps> = ({
  data,
  xKey,
  yKey,
  valueFormat = d3.format(','),
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data?.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create tooltip if it doesn't exist
    if (!tooltipRef.current) {
      const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none');
      tooltipRef.current = tooltip.node() as HTMLDivElement;
    }

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d[xKey] as string)) as [Date, Date])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Number(d[yKey])) || 0])
      .range([innerHeight, 0])
      .nice();

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2)
      .select('.domain')
      .remove();

    // Create line generator
    const line = d3.line<ChartDataPoint>()
      .x(d => xScale(new Date(d[xKey] as string)))
      .y(d => yScale(Number(d[yKey])))
      .curve(d3.curveMonotoneX);

    // Add line path
    const path = g.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', NOLK_COLORS.primary)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animate line drawing
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Add data points
    const dots = g.selectAll<SVGCircleElement, ChartDataPoint>('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(new Date(d[xKey] as string)))
      .attr('cy', d => yScale(Number(d[yKey])))
      .attr('r', 4)
      .attr('fill', NOLK_COLORS.primary)
      .attr('opacity', 0);

    dots.transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr('opacity', 1);

    // Add hover effects
    dots
      .on('mouseover', function(event: MouseEvent, d: ChartDataPoint) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6);

        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${d[xKey]}</strong><br/>
            ${valueFormat(Number(d[yKey]))}
          `);
      })
      .on('mousemove', (event: MouseEvent) => {
        d3.select(tooltipRef.current)
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 4);

        d3.select(tooltipRef.current)
          .style('visibility', 'hidden');
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => d3.timeFormat('%b %d')(d as Date));

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => valueFormat(Number(d)));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px');

    // Add labels
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Date');

    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Value');

  }, [data, xKey, yKey, valueFormat, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} />
    </div>
  );
};

export default D3LineChart;