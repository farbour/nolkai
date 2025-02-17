// file path: src/utils/csvParser.ts

interface CSVData {
  headers: string[];
  rows: string[][];
}

export function parseCSV(csvText: string): CSVData {
  // Split into lines and remove empty lines
  const lines = csvText.trim().split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV must contain headers and at least one data row');
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    if (values.length !== headers.length) {
      console.warn('Skipping invalid row: incorrect number of columns');
      return null;
    }
    return values;
  }).filter((row): row is string[] => row !== null);

  return { headers, rows };
}

// Parse a single CSV line handling quoted values
export function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  
  return values.map(v => v.replace(/["']/g, '').trim());
}

// Parse numeric values from CSV
export function parseNumericValue(value: string): number {
  if (!value) return 0;
  // Remove commas and convert to number
  const parsed = Number(value.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

// Create a typed object from CSV row
export function createTypedRow<T>(headers: string[], values: string[]): T {
  return headers.reduce((obj, header, index) => {
    obj[header as keyof T] = values[index] as T[keyof T];
    return obj;
  }, {} as T);
}