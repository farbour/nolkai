import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import csvParser from 'csv-parser';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const dataDir = path.join(__dirname, 'public/data');
const outputDir = path.join(__dirname, 'visualizations');
const width = 800;
const height = 600;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Initialize chart renderer
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour: 'white' });

// Function to parse CSV file
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to generate KPI distribution chart
async function generateKPIDistributionChart(data, filename) {
  // Count KPIs
  const kpiCounts = {};
  data.forEach(row => {
    const kpiName = row['KPI Name'];
    kpiCounts[kpiName] = (kpiCounts[kpiName] || 0) + 1;
  });
  
  // Sort KPIs by count (descending)
  const sortedKPIs = Object.entries(kpiCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 KPIs
  
  const labels = sortedKPIs.map(([kpi]) => kpi);
  const counts = sortedKPIs.map(([, count]) => count);
  
  // Create chart configuration
  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Number of Data Points',
        data: counts,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Top 10 KPIs by Data Point Count',
          font: { size: 18 }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'KPI Name'
          }
        }
      }
    }
  };
  
  // Generate chart
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  
  console.log(`Generated ${filename}`);
}

// Function to generate brand distribution chart
async function generateBrandDistributionChart(data, filename) {
  // Count brands
  const brandCounts = {};
  data.forEach(row => {
    const brand = row['Brand'];
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });
  
  // Sort brands by count (descending)
  const sortedBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1]);
  
  const labels = sortedBrands.map(([brand]) => brand);
  const counts = sortedBrands.map(([, count]) => count);
  
  // Create chart configuration
  const configuration = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
          'rgba(40, 159, 64, 0.8)',
          'rgba(210, 199, 199, 0.8)',
          'rgba(78, 52, 199, 0.8)',
          'rgba(225, 99, 132, 0.8)',
          'rgba(24, 162, 235, 0.8)',
          'rgba(215, 206, 86, 0.8)',
          'rgba(45, 192, 192, 0.8)',
          'rgba(123, 102, 255, 0.8)',
          'rgba(225, 159, 64, 0.8)',
          'rgba(169, 199, 199, 0.8)',
          'rgba(53, 102, 255, 0.8)',
          'rgba(10, 159, 64, 0.8)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Data Points by Brand',
          font: { size: 18 }
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 15
          }
        }
      }
    }
  };
  
  // Generate chart
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  
  console.log(`Generated ${filename}`);
}

// Function to generate year distribution chart
async function generateYearDistributionChart(data, filename) {
  // Count years
  const yearCounts = {};
  data.forEach(row => {
    const year = row['Year of Date'];
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  
  // Sort years chronologically
  const sortedYears = Object.entries(yearCounts)
    .sort((a, b) => a[0] - b[0]);
  
  const labels = sortedYears.map(([year]) => year);
  const counts = sortedYears.map(([, count]) => count);
  
  // Create chart configuration
  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Number of Data Points',
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Data Points by Year',
          font: { size: 18 }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Year'
          }
        }
      }
    }
  };
  
  // Generate chart
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  
  console.log(`Generated ${filename}`);
}

// Function to generate unit distribution chart
async function generateUnitDistributionChart(data, filename) {
  // Count units
  const unitCounts = {};
  data.forEach(row => {
    const unit = row['KPI Unit'];
    unitCounts[unit] = (unitCounts[unit] || 0) + 1;
  });
  
  const labels = Object.keys(unitCounts);
  const counts = Object.values(unitCounts);
  
  // Create chart configuration
  const configuration = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Distribution by Unit Type',
          font: { size: 18 }
        }
      }
    }
  };
  
  // Generate chart
  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  
  console.log(`Generated ${filename}`);
}

// Main function to process all CSV files
async function processCSVFiles() {
  try {
    // Get list of CSV files
    const files = await fs.promises.readdir(dataDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    console.log(`Found ${csvFiles.length} CSV files in the data directory.`);
    
    // Process each file
    for (const file of csvFiles) {
      const filePath = path.join(dataDir, file);
      const fileBaseName = path.basename(file, '.csv');
      
      console.log(`Processing ${file}...`);
      
      // Parse CSV data
      const data = await parseCSV(filePath);
      
      // Generate charts
      await generateKPIDistributionChart(data, `${fileBaseName}-kpi-distribution.png`);
      await generateBrandDistributionChart(data, `${fileBaseName}-brand-distribution.png`);
      await generateYearDistributionChart(data, `${fileBaseName}-year-distribution.png`);
      await generateUnitDistributionChart(data, `${fileBaseName}-unit-distribution.png`);
    }
    
    console.log('\nVisualization complete! Charts saved to the "visualizations" directory.');
    
  } catch (error) {
    console.error('Error processing CSV files:', error);
  }
}

// Run the visualization process
processCSVFiles();