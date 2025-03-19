-- E-commerce KPI Data Schema
-- SQL schema for e-commerce key performance indicators across multiple platforms

-- Create Brands table
CREATE TABLE Brands (
    BrandID INT PRIMARY KEY AUTO_INCREMENT,
    BrandName VARCHAR(100) NOT NULL,
    Category VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (BrandName)
);

-- Create KPI Definitions table
CREATE TABLE KPIDefinitions (
    KPIID INT PRIMARY KEY AUTO_INCREMENT,
    KPIName VARCHAR(100) NOT NULL,
    Description TEXT,
    Unit ENUM('%', '$', 'Number') NOT NULL,
    Category ENUM('Advertising', 'Revenue', 'Profitability', 'Customer Behavior', 'Inventory', 'Marketing'),
    Formula VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (KPIName)
);

-- Create Platforms table
CREATE TABLE Platforms (
    PlatformID INT PRIMARY KEY AUTO_INCREMENT,
    PlatformName VARCHAR(50) NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (PlatformName)
);

-- Create Brand-Platform relationship table
CREATE TABLE BrandPlatforms (
    BrandID INT NOT NULL,
    PlatformID INT NOT NULL,
    ActiveSince DATE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (BrandID, PlatformID),
    FOREIGN KEY (BrandID) REFERENCES Brands(BrandID) ON DELETE CASCADE,
    FOREIGN KEY (PlatformID) REFERENCES Platforms(PlatformID) ON DELETE CASCADE
);

-- Create Time Dimension table
CREATE TABLE TimeDimension (
    TimeID INT PRIMARY KEY AUTO_INCREMENT,
    Month ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December') NOT NULL,
    Year INT NOT NULL,
    Quarter TINYINT GENERATED ALWAYS AS (
        CASE 
            WHEN Month IN ('January', 'February', 'March') THEN 1
            WHEN Month IN ('April', 'May', 'June') THEN 2
            WHEN Month IN ('July', 'August', 'September') THEN 3
            WHEN Month IN ('October', 'November', 'December') THEN 4
        END
    ) STORED,
    FullDate DATE GENERATED ALWAYS AS (
        STR_TO_DATE(CONCAT('01-', Month, '-', Year), '%d-%M-%Y')
    ) STORED,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (Month, Year)
);

-- Create KPI Data Facts table
CREATE TABLE KPIData (
    KPIDataID INT PRIMARY KEY AUTO_INCREMENT,
    BrandID INT NOT NULL,
    KPIID INT NOT NULL,
    TimeID INT NOT NULL,
    PlatformID INT NOT NULL,
    Value DECIMAL(20, 6),
    IsEstimated BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (BrandID) REFERENCES Brands(BrandID) ON DELETE CASCADE,
    FOREIGN KEY (KPIID) REFERENCES KPIDefinitions(KPIID) ON DELETE CASCADE,
    FOREIGN KEY (TimeID) REFERENCES TimeDimension(TimeID) ON DELETE CASCADE,
    FOREIGN KEY (PlatformID) REFERENCES Platforms(PlatformID) ON DELETE CASCADE,
    UNIQUE (BrandID, KPIID, TimeID, PlatformID)
);

-- Create indexes for performance
CREATE INDEX idx_kpidata_brand ON KPIData(BrandID);
CREATE INDEX idx_kpidata_kpi ON KPIData(KPIID);
CREATE INDEX idx_kpidata_time ON KPIData(TimeID);
CREATE INDEX idx_kpidata_platform ON KPIData(PlatformID);
CREATE INDEX idx_timedimension_year ON TimeDimension(Year);
CREATE INDEX idx_timedimension_month ON TimeDimension(Month);
CREATE INDEX idx_timedimension_quarter ON TimeDimension(Quarter);

-- Insert platform data
INSERT INTO Platforms (PlatformName, Description) VALUES
('Amazon', 'Amazon e-commerce platform'),
('Shopify', 'Shopify e-commerce platform'),
('General', 'General or combined metrics');

-- Sample KPI definitions
INSERT INTO KPIDefinitions (KPIName, Description, Unit, Category, Formula) VALUES
('TACOS', 'Total Advertising Cost of Sales - the percentage of revenue spent on advertising', '%', 'Advertising', '(Ad Spend / Revenue) * 100'),
('Conversion Rate', 'Percentage of visitors who make a purchase', '%', 'Customer Behavior', '(Number of Sales / Number of Visitors) * 100'),
('D2C Contribution Margin', 'Direct-to-Consumer Contribution Margin', '$', 'Profitability', 'Revenue - Variable Costs'),
('Repeat Rate', 'Percentage of customers who make repeat purchases', '%', 'Customer Behavior', '(Repeat Customers / Total Customers) * 100'),
('Gross Revenue', 'Total revenue before deductions', '$', 'Revenue', NULL);

-- Views for easier querying

-- View for monthly KPI values by brand and platform
CREATE VIEW MonthlyKPIByBrandAndPlatform AS
SELECT 
    b.BrandName,
    k.KPIName,
    k.Unit,
    t.Month,
    t.Year,
    p.PlatformName,
    kd.Value
FROM KPIData kd
JOIN Brands b ON kd.BrandID = b.BrandID
JOIN KPIDefinitions k ON kd.KPIID = k.KPIID
JOIN TimeDimension t ON kd.TimeID = t.TimeID
JOIN Platforms p ON kd.PlatformID = p.PlatformID;

-- View for yearly KPI averages
CREATE VIEW YearlyKPIAverages AS
SELECT 
    b.BrandName,
    k.KPIName,
    k.Unit,
    t.Year,
    p.PlatformName,
    AVG(kd.Value) AS AverageValue
FROM KPIData kd
JOIN Brands b ON kd.BrandID = b.BrandID
JOIN KPIDefinitions k ON kd.KPIID = k.KPIID
JOIN TimeDimension t ON kd.TimeID = t.TimeID
JOIN Platforms p ON kd.PlatformID = p.PlatformID
GROUP BY b.BrandName, k.KPIName, k.Unit, t.Year, p.PlatformName;

-- View for KPI year-over-year growth
CREATE VIEW KPIYearOverYearGrowth AS
SELECT 
    current.BrandName,
    current.KPIName,
    current.Unit,
    current.Year AS CurrentYear,
    previous.Year AS PreviousYear,
    current.PlatformName,
    current.AverageValue AS CurrentValue,
    previous.AverageValue AS PreviousValue,
    ((current.AverageValue - previous.AverageValue) / previous.AverageValue) * 100 AS GrowthPercentage
FROM YearlyKPIAverages current
JOIN YearlyKPIAverages previous 
    ON current.BrandName = previous.BrandName 
    AND current.KPIName = previous.KPIName
    AND current.PlatformName = previous.PlatformName
    AND current.Year = previous.Year + 1
WHERE previous.AverageValue != 0;