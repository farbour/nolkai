// file path: src/lib/supabase.ts
import { Brand, BrandInfo } from '@/types/brand';

import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const brandTable = 'brands';

// Database record type
interface BrandRecord {
  id: string;
  name: string;
  slug: string;
  info?: BrandInfo;
  is_analyzing?: boolean;
  error?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to convert database record to Brand type
function convertToBrand(data: BrandRecord): Brand {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    info: data.info,
    isAnalyzing: data.is_analyzing || false,
    error: data.error,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getBrands(): Promise<Brand[]> {
  console.log('Fetching brands from Supabase...');
  const { data, error } = await supabase
    .from(brandTable)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
  
  console.log('Received brands data:', data);
  return (data || []).map(record => convertToBrand(record as BrandRecord));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from(brandTable)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching brand by slug:', error);
    throw error;
  }
  if (!data) return null;

  return convertToBrand(data as BrandRecord);
}

export async function createBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(brandTable)
    .insert([
      {
        name: brand.name,
        slug: brand.slug,
        info: brand.info,
        is_analyzing: brand.isAnalyzing || false,
        error: brand.error,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating brand:', error);
    throw error;
  }
  
  return convertToBrand(data as BrandRecord);
}

export async function updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
  // Convert camelCase to snake_case for database
  const dbUpdates: Partial<BrandRecord> = {
    name: updates.name,
    slug: updates.slug,
    info: updates.info,
    is_analyzing: updates.isAnalyzing,
    error: updates.error,
    updated_at: new Date().toISOString(),
  };

  // Remove undefined values
  Object.entries(dbUpdates).forEach(([key, value]) => {
    if (value === undefined) {
      delete dbUpdates[key as keyof BrandRecord];
    }
  });

  const { data, error } = await supabase
    .from(brandTable)
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating brand:', error);
    throw error;
  }

  return convertToBrand(data as BrandRecord);
}

export async function deleteBrand(id: string): Promise<void> {
  const { error } = await supabase
    .from(brandTable)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
}