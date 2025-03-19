import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
// Import ecommerce data from CSV files to Supabase
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV file paths
const csvFiles = [
  path.join(process.cwd(), 'public/data/amazon-ecommerce-kpis.csv'),
  path.join(process.cwd(), 'public/data/shopify-ecommerce-kpis.csv'),
  path.join(process.cwd(), 'public/data/general-ecommerce-kpis.csv')
];

// Map platform names to their IDs
const platformMap = {
  'Amazon': null,
  'Shopify': null,
  'General': null
};

// Map KPI names to their IDs
const kpiMap = {};

// Map brand names to their IDs
const brandMap = {};

// Map time dimensions to their IDs
const timeMap = {};

// Helper function to get or create a brand
async function getOrCreateBrand(brandName) {
  if (brandMap[brandName]) {
    return brandMap[brandName];
  }

  // Check if brand exists
  const { data: existingBrands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('name', brandName)
    .limit(1);

  if (existingBrands && existingBrands.length > 0) {
    brandMap[brandName] = existingBrands[0].id;
    return existingBrands[0].id;
  }

  // Create new brand
  const slug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const { data: newBrand, error } = await supabase
    .from('brands')
    .insert([
      {
        name: brandName,
        slug: slug
      }
    ])
    .select()
    .single();

  if (error) {
    console.error(`Error creating brand ${brandName}:`, error);
    throw error;
  }

  brandMap[brandName] = newBrand.id;
  return newBrand.id;
}

// Helper function to get or create a time dimension
async function getOrCreateTimeDimension(month, year) {
  const timeKey = `${month}-${year}`;
  
  if (timeMap[timeKey]) {
    return timeMap[timeKey];
  }

  // Check if time dimension exists
  const { data: existingTimes } = await supabase
    .from('time_dimension')
    .select('id, month, year')
    .eq('month', month)
    .eq('year', year)
    .limit(1);

  if (existingTimes && existingTimes.length > 0) {
    timeMap[timeKey] = existingTimes[0].id;
    return existingTimes[0].id;
  }

  // Create new time dimension
  const { data: newTime, error } = await supabase
    .from('time_dimension')
    .insert([
      {
        month: month,
        year: year
      }
    ])
    .select()
    .single();

  if (error) {
    console.error(`Error creating time dimension ${month}-${year}:`, error);
    throw error;
  }

  timeMap[timeKey] = newTime.id;
  return newTime.id;
}

// Initialize platform IDs
async function initializePlatforms() {
  const { data: platforms, error } = await supabase
    .from('platforms')
    .select('id, platform_name');

  if (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }

  platforms.forEach(platform => {
    platformMap[platform.platform_name] = platform.id;
  });

  console.log('Platforms initialized:', platformMap);
}

// Initialize KPI definitions
async function initializeKPIs() {
  const { data: kpis, error } = await supabase
    .from('kpi_definitions')
    .select('id, kpi_name');

  if (error) {
    console.error('Error fetching KPI definitions:', error);
    throw error;
  }

  kpis.forEach(kpi => {
    kpiMap[kpi.kpi_name] = kpi.id;
  });

  console.log(`Initialized ${Object.keys(kpiMap).length} KPIs`);
}

// Process a single CSV file
async function processCSVFile(filePath) {
  const platformName = path.basename(filePath).split('-')[0];
  const platformId = platformMap[platformName.charAt(0).toUpperCase() + platformName.slice(1)];
  
  if (!platformId) {
    console.error(`Platform not found for ${platformName}`);
    return;
  }

  console.log(`Processing ${filePath} for platform ${platformName} (${platformId})`);
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`Read ${results.length} rows from ${filePath}`);
        
        try {
          for (const row of results) {
            const brandName = row.Brand;
            const kpiName = row['KPI Name'];
            const month = row['Month of Date'];
            const year = parseInt(row['Year of Date'], 10);
            const value = row['This Period Value'] === '' || row['This Period Value'] === null 
              ? null 
              : parseFloat(row['This Period Value']);
            
            // Skip if any required field is missing
            if (!brandName || !kpiName || !month || isNaN(year)) {
              console.warn('Skipping row with missing data:', row);
              continue;
            }
            
            // Get or create brand
            const brandId = await getOrCreateBrand(brandName);
            
            // Skip if KPI not found
            if (!kpiMap[kpiName]) {
              console.warn(`KPI not found: ${kpiName}`);
              continue;
            }
            
            // Get or create time dimension
            const timeId = await getOrCreateTimeDimension(month, year);
            
            // Insert KPI data
            const { error } = await supabase
              .from('kpi_data')
              .insert([
                {
                  brand_id: brandId,
                  kpi_id: kpiMap[kpiName],
                  time_id: timeId,
                  platform_id: platformId,
                  value: value,
                  is_estimated: false
                }
              ])
              .select();
            
            if (error) {
              if (error.code === '23505') { // Unique violation
                console.log(`Duplicate entry for ${brandName}, ${kpiName}, ${month}-${year}, ${platformName}`);
              } else {
                console.error('Error inserting KPI data:', error);
              }
            }
          }
          
          console.log(`Finished processing ${filePath}`);
          resolve();
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error(`Error reading ${filePath}:`, error);
        reject(error);
      });
  });
}

// Main function
async function importData() {
  try {
    console.log('Starting data import...');
    
    // Initialize platforms and KPIs
    await initializePlatforms();
    await initializeKPIs();
    
    // Process each CSV file
    for (const csvFile of csvFiles) {
      await processCSVFile(csvFile);
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Run the import
importData();