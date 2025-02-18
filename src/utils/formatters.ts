// file path: src/utils/formatters.ts

export const formatNumber = (value: number): string => {
  // Format currency values
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  // Format percentages and other numbers
  if (value < 100) {
    return `${value.toFixed(1)}%`;
  }
  // Default formatting
  return value.toLocaleString();
};