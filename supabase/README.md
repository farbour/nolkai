# Supabase Data Import Guide

This guide explains how to set up Supabase tables and import data from CSV files into Supabase.

## Table Structure

The database schema includes the following tables:

1. **brands** - Information about brands
2. **platforms** - E-commerce platforms (Amazon, Shopify, General)
3. **kpi_definitions** - Definitions of Key Performance Indicators
4. **time_dimension** - Time dimension for data analysis
5. **brand_platforms** - Relationship between brands and platforms
6. **kpi_data** - The actual KPI data points

## Setup Process

### 1. Create Tables

The SQL migration files in the `supabase/migrations` directory contain the SQL statements to create the necessary tables.

### Automatic Table Creation

The import script now includes functionality to automatically create the necessary tables if they don't exist:

1. When you run `npm run import-ecommerce-data`, the script will:
   - Check if the tables exist in Supabase
   - If they don't exist, it will attempt to create them using the SQL migration files
   - If the automatic creation fails, it will provide instructions for manual creation

### Manual Table Creation

If automatic table creation fails, you can manually create the tables by running the SQL migration files in the Supabase dashboard SQL Editor.

### 2. Import Data

The project includes scripts to import data from CSV files into Supabase:

- `scripts/migrate-brands.ts` - Imports brands data
- `scripts/import-ecommerce-data.ts` - Imports KPI data from CSV files

## Running the Import Scripts

### Prerequisites

1. Install the required dependencies:
   ```
   npm install
   ```

2. Make sure you have a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Ensure the CSV files are in the correct locations:
   - `public/data/amazon-ecommerce-kpis.csv`
   - `public/data/shopify-ecommerce-kpis.csv`
   - `public/data/general-ecommerce-kpis.csv`

### Import Brands

Run the following command to import brands:

```bash
npm run migrate-brands
```

### Import KPI Data

Run the following command to import KPI data from CSV files:

```bash
npm run import-ecommerce-data
```

## CSV File Format

The CSV files should have the following columns:

- `Brand` - The brand name
- `KPI Name` - The name of the KPI
- `KPI Unit` - The unit of measurement (%, $, Number)
- `Month of Date` - The month (January, February, etc.)
- `Year of Date` - The year (e.g., 2023)
- `This Period Value` - The value of the KPI for the given period

## Troubleshooting

If you encounter issues during the import process:

1. **Table Creation Issues**: If you see a "relation does not exist" error:
   - The script will attempt to create the tables automatically
   - If that fails, follow the instructions provided by the script to create the tables manually
   - Make sure you have the necessary permissions in your Supabase project

1. **Fetch Failed Error**: If you see a "fetch failed" error, it's likely due to:
   - Missing or incorrect Supabase credentials in `.env.local`
   - Network connectivity issues
   - Supabase service being temporarily unavailable

2. **General Troubleshooting**:
   - Check that your Supabase credentials are correct
   - Ensure the CSV files are in the correct format and location
   - Verify that the tables have been created correctly in Supabase

## Data Model Relationships

The data model follows a star schema design:

- `kpi_data` is the fact table
- `brands`, `kpi_definitions`, `platforms`, and `time_dimension` are dimension tables
- `brand_platforms` is a bridge table for the many-to-many relationship between brands and platforms

This structure allows for efficient querying and analysis of KPI data across different dimensions.