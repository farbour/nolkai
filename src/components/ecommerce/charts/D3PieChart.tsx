import * as d3 from 'd3';

// file path: src/components/ecommerce/charts/D3PieChart.tsx
import React, { useEffect, useRef } from 'react';

interface ChartDataPoint extends Record<string, string | number> {
  [key: string]: string | number;
}

interface D3PieChartProps {
  data: ChartDataPoint[];
  valueKey: string;
  labelKey: string;
  valueFormat?: (value: number) => string;
  width?: number;
  height?: number;
}

export const D3PieChart: React.FC<D3PieChartProps> = ({
  data,
  valueKey,
  labelKey,
  valueFormat = d3.format(','),
  width = 400,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data?.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

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

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    // Create pie generator
    const pie = d3.pie<ChartDataPoint>()
      .value(d => Number(d[valueKey]))
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create chart group
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create pie slices
    const slices = g.selectAll<SVGGElement, d3.PieArcDatum<ChartDataPoint>>('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Add paths with animation
    slices.append('path')
      .attr('d', arc)
      .style('fill', (_, i) => colorScale(i.toString()))
      .style('opacity', 0.8)
      .style('stroke', 'white')
      .style('stroke-width', 2)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Add hover effects
    slices
      .on('mouseover', function(event: MouseEvent, d: d3.PieArcDatum<ChartDataPoint>) {
        const slice = d3.select(this);
        slice.select('path')
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('transform', () => {
            const centroid = arc.centroid(d);
            return `translate(${centroid[0] * 0.1},${centroid[1] * 0.1})`;
          });

        const total = d3.sum(data, item => Number(item[valueKey]));
        const percentage = ((Number(d.data[valueKey]) / total) * 100).toFixed(1);
        
        const tooltip = d3.select(tooltipRef.current);
        tooltip
          .style('visibility', 'visible')
          .html(`
            <strong>${d.data[labelKey]}</strong><br/>
            ${valueFormat(Number(d.data[valueKey]))}<br/>
            ${percentage}%
          `);
      })
      .on('mousemove', (event: MouseEvent) => {
        d3.select(tooltipRef.current)
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).select('path')
          .transition()
          .duration(200)
          .style('opacity', 0.8)
          .attr('transform', 'translate(0,0)');

        d3.select(tooltipRef.current)
          .style('visibility', 'hidden');
      });

    // Add labels
    const labelArc = d3.arc<d3.PieArcDatum<ChartDataPoint>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    slices.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .style('opacity', 0)
      .text(d => d.data[labelKey] as string)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);

  }, [data, valueKey, labelKey, valueFormat, width, height]);

  return (
    <div className="relative">
      <svg ref={svgRef} />
    </div>
  );
};

export default D3PieChart;