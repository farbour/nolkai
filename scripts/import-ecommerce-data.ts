import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';
import fetch from 'node-fetch';
// Import ecommerce data from CSV files to Supabase
import fs from 'fs';
import path from 'path';
import { resolve } from 'path';

// Load environment variables from .env.local
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (!result.parsed) {
  console.error('Failed to load .env.local file');
  console.error('Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.');
  console.log('Current environment variables:');
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set (length: ' + supabaseUrl.length + ')' : 'Not set'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'Not set'}`);
  process.exit(1);
}

// Create Supabase client with custom fetch implementation
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: { fetch }
});

// CSV file paths
const csvFiles = [
  path.join(process.cwd(), 'public/data/amazon-ecommerce-kpis.csv'),
  path.join(process.cwd(), 'public/data/shopify-ecommerce-kpis.csv'),
  path.join(process.cwd(), 'public/data/general-ecommerce-kpis.csv')
];

// Types
interface PlatformMap {
  [key: string]: string | null;
}

interface KpiMap {
  [key: string]: string;
}

interface BrandMap {
  [key: string]: string;
}

interface TimeMap {
  [key: string]: string;
}

interface CsvRow {
  Brand: string;
  'KPI Name': string;
  'Month of Date': string;
  'Year of Date': string;
  'This Period Value': string | null;
  [key: string]: string | null;
}

// Map platform names to their IDs
const platformMap: PlatformMap = {
  'Amazon': null,
  'Shopify': null,
  'General': null
};

// Map KPI names to their IDs
const kpiMap: KpiMap = {};

// Map brand names to their IDs
const brandMap: BrandMap = {};

// Map time dimensions to their IDs
const timeMap: TimeMap = {};

// Create tables if they don't exist
async function createTablesIfNotExist(): Promise<void> {
  try {
    console.log('Checking if tables exist...');
    
    // Try to query the platforms table to see if it exists
    const { error } = await supabase
      .from('platforms')
      .select('id')
      .limit(1);
    
    // If there's an error with code 42P01, the table doesn't exist
    if (error && error.code === '42P01') {
      console.log('Tables do not exist. Creating tables...');
      
      // Read the SQL migration files
      const brandsSql = fs.readFileSync(resolve(process.cwd(), 'supabase/migrations/create_brands_table.sql'), 'utf8');
      const kpiTablesSql = fs.readFileSync(resolve(process.cwd(), 'supabase/migrations/20250228_create_ecommerce_kpi_tables.sql'), 'utf8');
      
      // Execute the SQL to create the brands table
      console.log('Creating brands table...');
      const { error: brandsSqlError } = await supabase.rpc('exec_sql', { sql: brandsSql });
      
      if (brandsSqlError) {
        // If the rpc method doesn't exist, we need to use a different approach
        if (brandsSqlError.message.includes('function exec_sql') || brandsSqlError.code === '42883') {
          console.log('exec_sql function not available. Using direct SQL execution...');
          console.log('Please run the SQL migration files manually in the Supabase dashboard.');
          console.log('1. Go to your Supabase project dashboard');
          console.log('2. Navigate to the SQL Editor');
          console.log('3. Copy and paste the contents of supabase/migrations/create_brands_table.sql');
          console.log('4. Run the SQL');
          console.log('5. Copy and paste the contents of supabase/migrations/20250228_create_ecommerce_kpi_tables.sql');
          console.log('6. Run the SQL');
          throw new Error('Tables need to be created manually. Please follow the instructions above.');
        } else {
          console.error('Error creating brands table:', brandsSqlError);
          throw brandsSqlError;
        }
      }
      
      // Execute the SQL to create the KPI tables
      console.log('Creating KPI tables...');
      const { error: kpiTablesSqlError } = await supabase.rpc('exec_sql', { sql: kpiTablesSql });
      
      if (kpiTablesSqlError) {
        console.error('Error creating KPI tables:', kpiTablesSqlError);
        throw kpiTablesSqlError;
      }
      
      console.log('Tables created successfully!');
    }
  } catch (error) {
    console.error('Error checking or creating tables:', error);
    throw error;
  }
}

// Helper function to get or create a brand
async function getOrCreateBrand(brandName: string): Promise<string> {
  if (brandMap[brandName]) {
    return brandMap[brandName];
  }

  try {
    // Check if brand exists
    const { data: existingBrands, error: selectError } = await supabase
      .from('brands')
      .select('id, name')
      .eq('name', brandName)
      .limit(1);

    if (selectError) {
      console.error(`Error checking if brand ${brandName} exists:`, selectError);
      throw selectError;
    }

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

    if (!newBrand) {
      throw new Error(`Failed to create brand ${brandName}`);
    }

    brandMap[brandName] = newBrand.id;
    return newBrand.id;
  } catch (error) {
    console.error(`Error in getOrCreateBrand for ${brandName}:`, error);
    throw error;
  }
}

// Helper function to get or create a time dimension
async function getOrCreateTimeDimension(month: string, year: number): Promise<string> {
  const timeKey = `${month}-${year}`;
  
  if (timeMap[timeKey]) {
    return timeMap[timeKey];
  }

  try {
    // Check if time dimension exists
    const { data: existingTimes, error: selectError } = await supabase
      .from('time_dimension')
      .select('id, month, year')
      .eq('month', month)
      .eq('year', year)
      .limit(1);

    if (selectError) {
      console.error(`Error checking if time dimension ${month}-${year} exists:`, selectError);
      throw selectError;
    }

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

    if (!newTime) {
      throw new Error(`Failed to create time dimension ${month}-${year}`);
    }

    timeMap[timeKey] = newTime.id;
    return newTime.id;
  } catch (error) {
    console.error(`Error in getOrCreateTimeDimension for ${month}-${year}:`, error);
    throw error;
  }
}

// Initialize platform IDs
async function initializePlatforms(): Promise<void> {
  try {
    console.log('Connecting to Supabase...');
    console.log(`Supabase URL: ${supabaseUrl}`);
    console.log(`Supabase Key (first 5 chars): ${supabaseKey?.substring(0, 5) || 'undefined'}...`);
    
    console.log('Fetching platforms from Supabase...');
    
    const { data: platforms, error } = await supabase
      .from('platforms')
      .select('id, platform_name');

    if (error) {
      console.error('Error fetching platforms:', error);
      throw error;
    }

    if (!platforms) {
      throw new Error('No platforms found');
    }

    platforms.forEach(platform => {
      platformMap[platform.platform_name] = platform.id;
    });

    console.log('Platforms initialized:', platformMap);
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    throw error;
  }
}

// Initialize KPI definitions
async function initializeKPIs(): Promise<void> {
  try {
    console.log('Fetching KPI definitions from Supabase...');
    
    const { data: kpis, error } = await supabase
      .from('kpi_definitions')
      .select('id, kpi_name');

    if (error) {
      console.error('Error fetching KPI definitions:', error);
      throw error;
    }

    if (!kpis) {
      throw new Error('No KPI definitions found');
    }

    kpis.forEach(kpi => {
      kpiMap[kpi.kpi_name] = kpi.id;
    });

    console.log(`Initialized ${Object.keys(kpiMap).length} KPIs`);
  } catch (error) {
    console.error('Error initializing KPIs:', error);
    throw error;
  }
}

// Process a single CSV file
async function processCSVFile(filePath: string): Promise<void> {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`CSV file not found: ${filePath}`);
      return;
    }
    
    const platformName = path.basename(filePath).split('-')[0];
    const platformId = platformMap[platformName.charAt(0).toUpperCase() + platformName.slice(1)];
    
    if (!platformId) {
      console.error(`Platform not found for ${platformName}`);
      return;
    }

    console.log(`Processing ${filePath} for platform ${platformName} (${platformId})`);
    
    const results: CsvRow[] = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: CsvRow) => results.push(data))
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
        .on('error', (error: Error) => {
          console.error(`Error reading ${filePath}:`, error);
          reject(error);
        });
    });
  } catch (error) {
    console.error(`Error in processCSVFile for ${filePath}:`, error);
    throw error;
  }
}

// Main function
async function importData(): Promise<void> {
  try {
    console.log('Starting data import...');
    console.log('Checking CSV files...');
    
    // Check if CSV files exist
    for (const csvFile of csvFiles) {
      if (!fs.existsSync(csvFile)) {
        console.warn(`Warning: CSV file not found: ${csvFile}`);
      } else {
        console.log(`Found CSV file: ${csvFile}`);
      }
    }
    
    // Create tables if they don't exist
    console.log('Checking and creating tables if needed...');
    await createTablesIfNotExist();
    
    // Initialize platforms and KPIs
    await initializePlatforms();
    await initializeKPIs();
    
    // Process each CSV file
    for (const csvFile of csvFiles) {
      if (fs.existsSync(csvFile)) {
        await processCSVFile(csvFile);
      }
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

// Run the import
importData();