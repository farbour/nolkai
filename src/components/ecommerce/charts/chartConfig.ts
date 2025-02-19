// file path: src/components/ecommerce/charts/chartConfig.ts
import { NOLK_COLORS } from '@/constants/colors';

export const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        font: {
          size: 12,
        },
        color: NOLK_COLORS.primaryDark, // Ensure good contrast for legend text
      },
    },
    tooltip: {
      backgroundColor: NOLK_COLORS.primaryDark,
      padding: 16,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
      titleColor: NOLK_COLORS.background,
      bodyColor: NOLK_COLORS.background,
      cornerRadius: 8, // More rounded corners
      displayColors: true,
      boxPadding: 6,
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      tension: 0.3, // Makes lines more curved
      borderWidth: 2,
      borderJoinStyle: 'round',
      capBezierPoints: true,
    },
    bar: {
      borderRadius: 8, // Rounded bars
      borderSkipped: false, // Ensures all corners are rounded
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: NOLK_COLORS.primaryDark, // Ensure good contrast for axis labels
      },
    },
    y: {
      grid: {
        color: `${NOLK_COLORS.gray}20`, // Lighter grid lines
      },
      ticks: {
        color: NOLK_COLORS.primaryDark, // Ensure good contrast for axis labels
      },
    },
  },
};

// Using our new color palette for charts with good contrast
export const chartColors = [
  NOLK_COLORS.primary,      // Dark green
  NOLK_COLORS.accent2,      // Blue
  NOLK_COLORS.accent1,      // Yellow
  NOLK_COLORS.sage,         // Sage green
  NOLK_COLORS.lavender,     // Lavender
  NOLK_COLORS.primaryDark,  // Black for better contrast when needed
];

const getRGBAFromRGB = (rgb: string, alpha: number): string => {
  // Extract RGB values using regex
  const matches = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!matches) return rgb;
  
  const [, r, g, b] = matches; // Skip first element with empty destructuring
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getGradient = (ctx: CanvasRenderingContext2D, color: string) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, getRGBAFromRGB(color, 0.15)); // Slightly more transparent for better contrast
  return gradient;
};