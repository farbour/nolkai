-- E-commerce KPI Data Schema for Supabase (PostgreSQL)
-- SQL schema for e-commerce key performance indicators across multiple platforms

-- Create KPI Definitions table
CREATE TABLE IF NOT EXISTS kpi_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL CHECK (unit IN ('%', '$', 'Number')),
    category TEXT CHECK (category IN ('Advertising', 'Revenue', 'Profitability', 'Customer Behavior', 'Inventory', 'Marketing')),
    formula TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (kpi_name)
);

-- Create Platforms table
CREATE TABLE IF NOT EXISTS platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (platform_name)
);

-- Create Brand-Platform relationship table
CREATE TABLE IF NOT EXISTS brand_platforms (
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    active_since DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    PRIMARY KEY (brand_id, platform_id)
);

-- Create Time Dimension table
CREATE TABLE IF NOT EXISTS time_dimension (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month TEXT NOT NULL CHECK (month IN ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')),
    year INTEGER NOT NULL,
    quarter SMALLINT GENERATED ALWAYS AS (
        CASE 
            WHEN month IN ('January', 'February', 'March') THEN 1
            WHEN month IN ('April', 'May', 'June') THEN 2
            WHEN month IN ('July', 'August', 'September') THEN 3
            WHEN month IN ('October', 'November', 'December') THEN 4
        END
    ) STORED,
    full_date DATE GENERATED ALWAYS AS (
        DATE_TRUNC('month', make_date(year, 
            CASE 
                WHEN month = 'January' THEN 1
                WHEN month = 'February' THEN 2
                WHEN month = 'March' THEN 3
                WHEN month = 'April' THEN 4
                WHEN month = 'May' THEN 5
                WHEN month = 'June' THEN 6
                WHEN month = 'July' THEN 7
                WHEN month = 'August' THEN 8
                WHEN month = 'September' THEN 9
                WHEN month = 'October' THEN 10
                WHEN month = 'November' THEN 11
                WHEN month = 'December' THEN 12
            END, 1))
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (month, year)
);

-- Create KPI Data Facts table
CREATE TABLE IF NOT EXISTS kpi_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    kpi_id UUID NOT NULL REFERENCES kpi_definitions(id) ON DELETE CASCADE,
    time_id UUID NOT NULL REFERENCES time_dimension(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    value DECIMAL(20, 6),
    is_estimated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (brand_id, kpi_id, time_id, platform_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kpidata_brand ON kpi_data(brand_id);
CREATE INDEX IF NOT EXISTS idx_kpidata_kpi ON kpi_data(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpidata_time ON kpi_data(time_id);
CREATE INDEX IF NOT EXISTS idx_kpidata_platform ON kpi_data(platform_id);
CREATE INDEX IF NOT EXISTS idx_timedimension_year ON time_dimension(year);
CREATE INDEX IF NOT EXISTS idx_timedimension_month ON time_dimension(month);
CREATE INDEX IF NOT EXISTS idx_timedimension_quarter ON time_dimension(quarter);

-- Create functions to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_kpi_definitions_updated_at ON kpi_definitions;
CREATE TRIGGER update_kpi_definitions_updated_at
  BEFORE UPDATE ON kpi_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_platforms_updated_at ON platforms;
CREATE TRIGGER update_platforms_updated_at
  BEFORE UPDATE ON platforms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brand_platforms_updated_at ON brand_platforms;
CREATE TRIGGER update_brand_platforms_updated_at
  BEFORE UPDATE ON brand_platforms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kpi_data_updated_at ON kpi_data;
CREATE TRIGGER update_kpi_data_updated_at
  BEFORE UPDATE ON kpi_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_dimension ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_data ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access on kpi_definitions"
  ON kpi_definitions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access on platforms"
  ON platforms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access on brand_platforms"
  ON brand_platforms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access on time_dimension"
  ON time_dimension FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous read access on kpi_data"
  ON kpi_data FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access on kpi_definitions"
  ON kpi_definitions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access on platforms"
  ON platforms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access on brand_platforms"
  ON brand_platforms FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access on time_dimension"
  ON time_dimension FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access on kpi_data"
  ON kpi_data FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert platform data
INSERT INTO platforms (platform_name, description) VALUES
('Amazon', 'Amazon e-commerce platform'),
('Shopify', 'Shopify e-commerce platform'),
('General', 'General or combined metrics')
ON CONFLICT (platform_name) DO NOTHING;

-- Sample KPI definitions
INSERT INTO kpi_definitions (kpi_name, description, unit, category, formula) VALUES
('TACOS', 'Total Advertising Cost of Sales - the percentage of revenue spent on advertising', '%', 'Advertising', '(Ad Spend / Revenue) * 100'),
('Conversion Rate', 'Percentage of visitors who make a purchase', '%', 'Customer Behavior', '(Number of Sales / Number of Visitors) * 100'),
('D2C Contribution Margin', 'Direct-to-Consumer Contribution Margin', '$', 'Profitability', 'Revenue - Variable Costs'),
('Repeat Rate', 'Percentage of customers who make repeat purchases', '%', 'Customer Behavior', '(Repeat Customers / Total Customers) * 100'),
('Gross Revenue', 'Total revenue before deductions', '$', 'Revenue', NULL)
ON CONFLICT (kpi_name) DO NOTHING;