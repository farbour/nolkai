// file path: src/types/theme.ts

export type ColorType = 
  | 'primary'
  | 'primaryDark'
  | 'background'
  | 'backgroundAlt'
  | 'accent1'
  | 'accent2'
  | 'gray'
  | 'sage'
  | 'lavender';

export type StyleType = 'bg' | 'text' | 'border';

export type AlertType = 'success' | 'warning' | 'info';

export type ThemeColor = keyof typeof import('../constants/colors').NOLK_COLORS;