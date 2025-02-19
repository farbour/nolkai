import { brands } from '../src/config/brands';
// file path: scripts/migrate-brands.ts
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import dns from 'dns';
import fetch from 'node-fetch';
import { resolve } from 'path';
import { sanitizeBrandName } from '../src/utils/brandAnalysisStorage';

// Configure DNS to use Google's DNS servers
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load environment variables from .env.local
const result = config({ path: resolve(process.cwd(), '.env.local') });

if (!result.parsed) {
  console.error('Failed to load .env.local file');
  process.exit(1);
}

const supabaseUrl = 'https://najvmybykjrelvifyacc.supabase.co';
const supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hanZteWJ5a2pyZWx2aWZ5YWNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk4MjI5MCwiZXhwIjoyMDU1NTU4MjkwfQ.enEBdKKaD9kQOCLX4iggmZEWdaHvNnG5O1TQW7l_Jxw';

if (!supabaseServiceRole) {
  console.error('Missing required Supabase service role key');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key (first 10 chars):', supabaseServiceRole.slice(0, 10) + '...');

// Create Supabase client with custom fetch implementation
const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    // @ts-expect-error - node-fetch types are incompatible with Supabase's fetch type
    fetch: fetch,
  },
});

const brandTable = 'brands';

async function createBrand(brand: { name: string; slug: string }) {
  const { data, error } = await supabase
    .from(brandTable)
    .insert([
      {
        ...brand,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function migrateBrands() {
  console.log('Starting brand migration...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  // First, try to create the table
  const { error: sqlError } = await supabase
    .from(brandTable)
    .select('id')
    .limit(1);

  if (sqlError) {
    console.log('Table does not exist, creating it...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS brands (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        info JSONB,
        is_analyzing BOOLEAN DEFAULT false,
        error TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );

      CREATE INDEX IF NOT EXISTS brands_slug_idx ON brands(slug);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = TIMEZONE('utc'::text, NOW());
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
      CREATE TRIGGER update_brands_updated_at
        BEFORE UPDATE ON brands
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (createError) {
      console.error('Failed to create table:', createError);
      process.exit(1);
    }
    console.log('Table created successfully');
  }
  
  for (const brand of brands) {
    try {
      const sanitizedName = sanitizeBrandName(brand);
      await createBrand({
        name: sanitizedName,
        slug: sanitizedName,
      });
      console.log(`✓ Migrated brand: ${brand}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate key')) {
        console.log(`⚠ Brand already exists: ${brand}`);
      } else {
        console.error(`✗ Failed to migrate brand ${brand}:`, error);
      }
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('Brand migration completed');
}

migrateBrands().catch(console.error);