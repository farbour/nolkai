// file path: src/utils/styleUtils.ts
import { AlertType, ColorType, StyleType } from '@/types/theme';
import { BellIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';

const colors: Record<ColorType, Record<StyleType, string>> = {
  primary: {
    bg: 'bg-[rgb(52,76,69)] group-hover:bg-[rgb(52,76,69)]/90',
    text: 'text-[rgb(249,243,233)]', // Light text for dark background
    border: 'border-[rgb(52,76,69)]'
  },
  primaryDark: {
    bg: 'bg-black group-hover:bg-black/90',
    text: 'text-[rgb(249,243,233)]', // Light text for dark background
    border: 'border-black'
  },
  background: {
    bg: 'bg-[rgb(249,243,233)]',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(249,243,233)]'
  },
  backgroundAlt: {
    bg: 'bg-[rgb(255,252,246)]',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(255,252,246)]'
  },
  accent1: {
    bg: 'bg-[rgb(227,183,143)] group-hover:bg-[rgb(227,183,143)]/90',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(227,183,143)]'
  },
  accent2: {
    bg: 'bg-[rgb(140,165,255)] group-hover:bg-[rgb(140,165,255)]/90',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(140,165,255)]'
  },
  gray: {
    bg: 'bg-[rgb(202,202,202)] group-hover:bg-[rgb(202,202,202)]/90',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(202,202,202)]'
  },
  sage: {
    bg: 'bg-[rgb(195,206,189)] group-hover:bg-[rgb(195,206,189)]/90',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(195,206,189)]'
  },
  lavender: {
    bg: 'bg-[rgb(239,226,252)] group-hover:bg-[rgb(239,226,252)]/90',
    text: 'text-[rgb(52,76,69)]', // Dark text for light background
    border: 'border-[rgb(239,226,252)]'
  }
};

const defaultColor: ColorType = 'primary';

export const getColorClass = (color: ColorType | undefined, type: StyleType): string => {
  return colors[color || defaultColor][type];
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-[rgb(52,76,69)] bg-[rgb(195,206,189)]/20'; // Dark text on light sage
  if (score >= 60) return 'text-[rgb(52,76,69)] bg-[rgb(227,183,143)]/20'; // Dark text on light sand
  return 'text-[rgb(249,243,233)] bg-[rgb(140,165,255)]'; // Light text on blue
};

export const getChangeColor = (change: number): string => {
  if (change > 0) return 'text-[rgb(52,76,69)]'; // Dark green for positive
  if (change < 0) return 'text-[rgb(140,165,255)]'; // Blue for negative
  return 'text-[rgb(202,202,202)]'; // Gray for neutral
};

export const getAlertStyles = (type: AlertType) => {
  const styles = {
    success: {
      bg: 'bg-[rgb(195,206,189)]/20',
      border: 'border-[rgb(195,206,189)]',
      text: 'text-[rgb(52,76,69)]', // Dark text on light background
      icon: SparklesIcon,
    },
    warning: {
      bg: 'bg-[rgb(227,183,143)]/20', // Using warm sand color for warnings
      border: 'border-[rgb(227,183,143)]',
      text: 'text-[rgb(52,76,69)]', // Dark text on light background
      icon: BoltIcon,
    },
    info: {
      bg: 'bg-[rgb(140,165,255)]/20',
      border: 'border-[rgb(140,165,255)]',
      text: 'text-[rgb(52,76,69)]', // Dark text on light background
      icon: BellIcon,
    },
  };
  return styles[type];
};