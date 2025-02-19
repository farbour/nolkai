// file path: src/constants/colors.ts
export const NOLK_COLORS = {
  // Primary Colors
  primary: 'rgb(52, 76, 69)', // Dark green
  primaryDark: 'rgb(0, 0, 0)', // Black

  // Background Colors
  background: 'rgb(249, 243, 233)', // Warm off-white
  backgroundAlt: 'rgb(255, 252, 246)', // Lighter off-white
  
  // Accent Colors
  accent1: 'rgb(227, 183, 143)', // Warm sand color instead of bright yellow
  accent2: 'rgb(140, 165, 255)', // Blue
  accent2Alpha: 'rgba(140, 165, 255, 0.6)', // Blue with opacity
  
  // UI Elements
  gray: 'rgb(202, 202, 202)',
  grayAlpha: 'rgba(138, 138, 138, 0.5)',
  overlay: 'rgba(146, 146, 146, 0.06)',
  transparent: [
    'rgba(250, 244, 235, 0)',
    'rgba(255, 255, 255, 0)'
  ],
  
  // Additional Accents
  sage: 'rgb(195, 206, 189)', // Sage green
  lavender: 'rgb(239, 226, 252)', // Soft lavender
  
  // Chart Colors - A balanced palette for data visualization
  chart: [
    'rgb(52, 76, 69)',    // Dark green
    'rgb(140, 165, 255)', // Blue
    'rgb(227, 183, 143)', // Warm sand
    'rgb(195, 206, 189)', // Sage
    'rgb(239, 226, 252)', // Lavender
    'rgb(202, 202, 202)'  // Gray
  ]
} as const;