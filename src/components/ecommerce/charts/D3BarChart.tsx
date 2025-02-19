import * as d3 from 'd3';

// file path: src/components/ecommerce/charts/D3BarChart.tsx
import React, { useEffect, useRef } from 'react';

import { NOLK_COLORS } from '@/constants/colors';

interface ChartDataPoint extends Record<string, string | number> {
  [key: string]: string | number;
}

interface D3BarChartProps {
  data: ChartDataPoint[];
  indexBy: string;
  keys: string[];
  valueFormat?: (value: number) => string;
  width?: number;
  height?: number;
}

export const D3BarChart: React.FC<D3BarChartProps> = ({
  data,
  indexBy,
  keys,
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
    const margin = { top: 40, right: 30, bottom: 60, left: 120 };
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
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Number(d[keys[0]])) || 0])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleBand()
      .domain(data.map(d => String(d[indexBy])))
      .range([0, innerHeight])
      .padding(0.2);

    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => String(d[indexBy])))
      .range(d3.schemeCategory10);

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisBottom(xScale)
        .tickSize(innerHeight)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2)
      .select('.domain')
      .remove();

    // Create and animate bars
    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d: ChartDataPoint) => yScale(String(d[indexBy])) || 0)
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('fill', (d: ChartDataPoint) => colorScale(String(d[indexBy])))
      .attr('width', 0)
      .transition()
      .duration(1000)
      .attr('width', (d: ChartDataPoint) => xScale(Number(d[keys[0]])));

    // Add hover effects and tooltip
    g.selectAll('.bar')
      .on('mouseover', function(this: SVGRectElement, event: MouseEvent, d: ChartDataPoint) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', NOLK_COLORS.primary);

        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${d[indexBy]}</strong><br/>
            ${valueFormat(Number(d[keys[0]]))}
          `);
      })
      .on('mousemove', (event: MouseEvent) => {
        d3.select(tooltipRef.current)
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function(this: SVGRectElement, event: MouseEvent, d: ChartDataPoint) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('fill', colorScale(String(d[indexBy])));

        d3.select(tooltipRef.current)
          .style('visibility', 'hidden');
      });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => valueFormat(Number(d)));

    const yAxis = d3.axisLeft(yScale);

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
      .text('Value');

  }, [data, indexBy, keys, valueFormat, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} />
    </div>
  );
};

export default D3BarChart;