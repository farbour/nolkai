// file path: src/utils/styleUtils.ts

import { AlertType, ColorType, StyleType } from '@/types/theme';
import { BellIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';

const colors: Record<ColorType, Record<StyleType, string>> = {
  green: {
    bg: 'bg-green-50 group-hover:bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200'
  },
  blue: {
    bg: 'bg-blue-50 group-hover:bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  purple: {
    bg: 'bg-purple-50 group-hover:bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200'
  },
  indigo: {
    bg: 'bg-indigo-50 group-hover:bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200'
  }
};

export const getColorClass = (color: ColorType, type: StyleType): string => {
  return colors[color][type];
};

export const getAlertStyles = (type: AlertType) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: SparklesIcon,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: BoltIcon,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: BellIcon,
    },
  };
  return styles[type];
};