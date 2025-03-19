# CSV Data Analysis Tools

This repository contains tools for analyzing and visualizing CSV data files in the `data` directory.

## Overview

The tools in this repository allow you to:

1. Analyze the structure of CSV files
2. Generate statistical summaries of the data
3. Create visualizations of key data patterns
4. Understand the relationships between different data elements

## Files

- `analyze-csv.mjs`: Basic script to examine the first 20 lines of CSV files
- `full-csv-analyzer.mjs`: Comprehensive script to analyze entire CSV files with detailed statistics
- `visualize-csv-data.mjs`: Script to generate visualizations from CSV data
- `csv-data-summary.md`: Summary report of the CSV data structure and insights

## Installation

To use these tools, you need Node.js installed on your system.

1. Install dependencies for the visualization tool:

```bash
npm install --package=csv-visualizer-package.json
```

## Usage

### Basic CSV Analysis

To get a quick overview of the CSV files (first 20 lines):

```bash
node analyze-csv.mjs
```

This will output:
- File structure (headers, data types)
- Sample data (first 3 rows)
- Basic column information

### Comprehensive CSV Analysis

For a detailed analysis of the entire CSV files:

```bash
node full-csv-analyzer.mjs
```

This will output:
- Complete file structure
- Statistical information about each column
- Data distribution patterns
- Cross-file comparisons

### Data Visualization

To generate charts and visualizations from the CSV data:

```bash
node visualize-csv-data.mjs
```

This will:
1. Create a `visualizations` directory
2. Generate the following charts for each CSV file:
   - KPI distribution chart
   - Brand distribution chart
   - Year distribution chart
   - Unit distribution chart

## Data Structure

The CSV files in the `data` directory share a common structure with 6 columns:

| Column Name | Data Type | Description |
|-------------|-----------|-------------|
| Brand | string | The name of the brand |
| KPI Name | string | The name of the key performance indicator |
| KPI Unit | string | The unit of measurement (%, $, Number) |
| Month of Date | string | The month |
| Year of Date | number | The year |
| This Period Value | string/number | The value of the KPI for the specified period |

## Insights

The analysis reveals:

1. The data contains e-commerce KPI metrics from different platforms (Amazon, Shopify)
2. The dataset covers 16-19 different brands
3. There are 34-70 different KPI metrics tracked
4. The data spans multiple years (2021-2025) with monthly granularity
5. Some data points are missing or have zero values

For more detailed insights, refer to the `csv-data-summary.md` file.

## Extending the Tools

These scripts can be extended to:

1. Add more visualization types
2. Perform more advanced statistical analysis
3. Export data to different formats
4. Implement machine learning for predictive analytics

## Notes

- The visualization script requires additional dependencies (chart.js, chartjs-node-canvas, csv-parser)
- Large CSV files may require more memory to process