import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ghanaBackgroundImage from '../Assets/hammer-gave234649.jpg';

// West and East African Countries
export type CountryTheme = 
  // West Africa
  | 'ghana' | 'nigeria' | 'senegal' | 'cote-divoire' | 'mali' | 'burkina-faso' | 'niger'
  | 'guinea' | 'sierra-leone' | 'liberia' | 'togo' | 'benin' | 'gambia' | 'guinea-bissau'
  | 'cape-verde' | 'cameroon' | 'equatorial-guinea' | 'gabon' | 'congo' | 'central-african-republic'
  | 'chad' | 'sao-tome-and-principe'
  // East Africa
  | 'kenya' | 'tanzania' | 'uganda' | 'rwanda' | 'burundi' 
  | 'ethiopia' | 'eritrea' | 'djibouti' | 'somalia' | 'south-sudan'
  | 'madagascar' | 'seychelles' | 'comoros' | 'mauritius';

export interface ThemeColors {
  // Primary colors (main flag color)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySubtle: string;
  
  // Accent colors (secondary flag color)
  accent: string;
  accentLight: string;
  accentDark: string;
  accentSubtle: string;
  
  // Secondary colors (tertiary flag color)
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondarySubtle: string;
  
  // Additional flag colors for more comprehensive theming
  tertiary?: string;
  tertiaryLight?: string;
  tertiaryDark?: string;
  
  // Legacy aliases for backward compatibility
  primaryBlue: string;
  primaryBlueLight: string;
  primaryBlueDark: string;
  secondaryBlue: string;
  
  // Status colors (derived from flag colors)
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Text and UI colors
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  cardBackground: string;
}

export interface BackgroundConfig {
  type: 'gradient' | 'image';
  gradient: string; // CSS gradient string based on flag colors
  image?: string; // Image URL (optional)
  overlay: string; // Overlay gradient for text readability
  pattern?: string; // Additional pattern if needed
}

export interface CountryThemeConfig {
  name: string;
  flag: string; // Emoji flag
  colors: ThemeColors;
  background: BackgroundConfig;
}

// Helper function to create gradient from flag colors
const createFlagGradient = (color1: string, color2: string, color3?: string, color4?: string, angle: string = '135deg'): string => {
  if (color4) {
    return `linear-gradient(${angle}, ${color1} 0%, ${color2} 33%, ${color3} 66%, ${color4} 100%)`;
  }
  if (color3) {
    return `linear-gradient(${angle}, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
  }
  return `linear-gradient(${angle}, ${color1} 0%, ${color2} 100%)`;
};

// Helper function to create overlay gradient
const createOverlay = (color1: string, color2: string, color3?: string, opacity: number = 0.75): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (color3) {
    const rgb3 = hexToRgb(color3);
    return `linear-gradient(135deg, rgba(${rgb1}, ${opacity}) 0%, rgba(${rgb2}, ${opacity - 0.05}) 50%, rgba(${rgb3}, ${opacity}) 100%)`;
  }
  return `linear-gradient(135deg, rgba(${rgb1}, ${opacity}) 0%, rgba(${rgb2}, ${opacity}) 100%)`;
};

// Helper to convert hex to rgb
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

// Note: lighten/darken functions removed as we're using explicit color values

const countryThemes: Record<CountryTheme, CountryThemeConfig> = {
  // Ghana - Red, Gold, Green (with background image)
  ghana: {
    name: 'Ghana',
    flag: '🇬🇭',
    colors: {
      primary: '#CE1126', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#FCD116', // Gold
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#006B3F', // Green
      secondaryLight: '#008751',
      secondaryDark: '#004D2E',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#CE1126',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#006B3F',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#CE1126',
      textPrimary: '#CE1126',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'image',
      image: ghanaBackgroundImage,
      gradient: ghanaBackgroundImage, // Use image URL for gradient when type is image
      overlay: createOverlay('#CE1126', '#FCD116', '#006B3F', 0.75),
    },
  },
  
  // Nigeria - Green, White, Green
  nigeria: {
    name: 'Nigeria',
    flag: '🇳🇬',
    colors: {
      primary: '#008751', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#008751', // Green
      secondaryLight: '#00A862',
      secondaryDark: '#006B3F',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#008751',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#008751',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#008751',
      textPrimary: '#008751',
      textSecondary: '#374151',
      borderColor: '#008751',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#008751', '#FFFFFF', '#008751', undefined, '90deg'),
      overlay: createOverlay('#008751', '#FFFFFF', '#008751', 0.75),
    },
  },
  
  // Senegal - Green, Yellow, Red
  senegal: {
    name: 'Senegal',
    flag: '🇸🇳',
    colors: {
      primary: '#00853F', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#00853F',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#00853F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#00853F',
      textPrimary: '#00853F',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#00853F', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#00853F', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Côte d'Ivoire - Orange, White, Green
  'cote-divoire': {
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    colors: {
      primary: '#F77F00', // Orange
      primaryLight: '#FF9500',
      primaryDark: '#D66A00',
      primarySubtle: '#FFF4E6',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#009639', // Green
      secondaryLight: '#00A862',
      secondaryDark: '#006B3F',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#F77F00',
      primaryBlueLight: '#FF9500',
      primaryBlueDark: '#D66A00',
      secondaryBlue: '#FFF4E6',
      success: '#009639',
      warning: '#F77F00',
      error: '#DC2626',
      info: '#F77F00',
      textPrimary: '#F77F00',
      textSecondary: '#374151',
      borderColor: '#009639',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#F77F00', '#FFFFFF', '#009639', undefined, '90deg'),
      overlay: createOverlay('#F77F00', '#FFFFFF', '#009639', 0.75),
    },
  },
  
  // Mali - Green, Yellow, Red
  mali: {
    name: 'Mali',
    flag: '🇲🇱',
    colors: {
      primary: '#14B53A', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#14B53A',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#14B53A',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#14B53A',
      textPrimary: '#14B53A',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#14B53A', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#14B53A', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Burkina Faso - Red, Green
  'burkina-faso': {
    name: 'Burkina Faso',
    flag: '🇧🇫',
    colors: {
      primary: '#EF2B2D', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#FCD116', // Yellow star
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#EF2B2D', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#EF2B2D',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#EF2B2D',
      info: '#EF2B2D',
      textPrimary: '#EF2B2D',
      textSecondary: '#374151',
      borderColor: '#EF2B2D',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#EF2B2D', '#FCD116', '#EF2B2D', undefined, '90deg'),
      overlay: createOverlay('#EF2B2D', '#FCD116', '#EF2B2D', 0.75),
    },
  },
  
  // Niger - Orange, White, Green
  niger: {
    name: 'Niger',
    flag: '🇳🇪',
    colors: {
      primary: '#E05206', // Orange
      primaryLight: '#FF6B00',
      primaryDark: '#C04400',
      primarySubtle: '#FFF0E6',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#14B53A', // Green
      secondaryLight: '#00A862',
      secondaryDark: '#006B3F',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#E05206',
      primaryBlueLight: '#FF6B00',
      primaryBlueDark: '#C04400',
      secondaryBlue: '#FFF0E6',
      success: '#14B53A',
      warning: '#E05206',
      error: '#DC2626',
      info: '#E05206',
      textPrimary: '#E05206',
      textSecondary: '#374151',
      borderColor: '#14B53A',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#E05206', '#FFFFFF', '#14B53A', undefined, '90deg'),
      overlay: createOverlay('#E05206', '#FFFFFF', '#14B53A', 0.75),
    },
  },
  
  // Guinea - Red, Yellow, Green
  guinea: {
    name: 'Guinea',
    flag: '🇬🇳',
    colors: {
      primary: '#CE1126', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#006B3F', // Green
      secondaryLight: '#008751',
      secondaryDark: '#004D2E',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#CE1126',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#CE1126',
      textPrimary: '#CE1126',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#CE1126', '#FCD116', '#006B3F', undefined, '90deg'),
      overlay: createOverlay('#CE1126', '#FCD116', '#006B3F', 0.75),
    },
  },
  
  // Sierra Leone - Green, White, Blue
  'sierra-leone': {
    name: 'Sierra Leone',
    flag: '🇸🇱',
    colors: {
      primary: '#0072C6', // Blue
      primaryLight: '#3B82F6',
      primaryDark: '#1E40AF',
      primarySubtle: '#DBEAFE',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#1EB53A', // Green
      secondaryLight: '#00A862',
      secondaryDark: '#006B3F',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#0072C6',
      primaryBlueLight: '#3B82F6',
      primaryBlueDark: '#1E40AF',
      secondaryBlue: '#DBEAFE',
      success: '#1EB53A',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#0072C6',
      textPrimary: '#0072C6',
      textSecondary: '#374151',
      borderColor: '#1EB53A',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#0072C6', '#FFFFFF', '#1EB53A', undefined, '90deg'),
      overlay: createOverlay('#0072C6', '#FFFFFF', '#1EB53A', 0.75),
    },
  },
  
  // Liberia - Red, White stripes, Blue with star
  liberia: {
    name: 'Liberia',
    flag: '🇱🇷',
    colors: {
      primary: '#002868', // Blue
      primaryLight: '#1E40AF',
      primaryDark: '#1E3A8A',
      primarySubtle: '#DBEAFE',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#BF0A30', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#002868',
      primaryBlueLight: '#1E40AF',
      primaryBlueDark: '#1E3A8A',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#F59E0B',
      error: '#BF0A30',
      info: '#002868',
      textPrimary: '#002868',
      textSecondary: '#374151',
      borderColor: '#BF0A30',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#002868', '#FFFFFF', '#BF0A30', undefined, '90deg'),
      overlay: createOverlay('#002868', '#FFFFFF', '#BF0A30', 0.75),
    },
  },
  
  // Togo - Green, Yellow, Red
  togo: {
    name: 'Togo',
    flag: '🇹🇬',
    colors: {
      primary: '#006A4E', // Green
      primaryLight: '#008751',
      primaryDark: '#004D2E',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#006A4E',
      primaryBlueLight: '#008751',
      primaryBlueDark: '#004D2E',
      secondaryBlue: '#E6F5ED',
      success: '#006A4E',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#006A4E',
      textPrimary: '#006A4E',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#006A4E', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#006A4E', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Benin - Green, Yellow, Red
  benin: {
    name: 'Benin',
    flag: '🇧🇯',
    colors: {
      primary: '#008751', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#008751',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#008751',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#008751',
      textPrimary: '#008751',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#008751', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#008751', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Gambia - Red, White, Blue, Green
  gambia: {
    name: 'Gambia',
    flag: '🇬🇲',
    colors: {
      primary: '#CE1126', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#006B3F', // Green
      secondaryLight: '#008751',
      secondaryDark: '#004D2E',
      secondarySubtle: '#E6F5ED',
      tertiary: '#003F87', // Blue
      tertiaryLight: '#1E40AF',
      tertiaryDark: '#1E3A8A',
      primaryBlue: '#CE1126',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#006B3F',
      warning: '#F59E0B',
      error: '#CE1126',
      info: '#003F87',
      textPrimary: '#CE1126',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#CE1126', '#FFFFFF', '#003F87', '#006B3F', '90deg'),
      overlay: createOverlay('#CE1126', '#FFFFFF', '#006B3F', 0.75),
    },
  },
  
  // Guinea-Bissau - Red, Yellow, Green
  'guinea-bissau': {
    name: 'Guinea-Bissau',
    flag: '🇬🇼',
    colors: {
      primary: '#CE1126', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#006B3F', // Green
      secondaryLight: '#008751',
      secondaryDark: '#004D2E',
      secondarySubtle: '#E6F5ED',
      primaryBlue: '#CE1126',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#CE1126',
      textPrimary: '#CE1126',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#CE1126', '#FCD116', '#006B3F', undefined, '90deg'),
      overlay: createOverlay('#CE1126', '#FCD116', '#006B3F', 0.75),
    },
  },
  
  // Cape Verde - Blue, White, Red
  'cape-verde': {
    name: 'Cape Verde',
    flag: '🇨🇻',
    colors: {
      primary: '#003F87', // Blue
      primaryLight: '#1E40AF',
      primaryDark: '#1E3A8A',
      primarySubtle: '#DBEAFE',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#CF2027', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      tertiary: '#FCD116', // Yellow stars
      tertiaryLight: '#FDE68A',
      tertiaryDark: '#F59E0B',
      primaryBlue: '#003F87',
      primaryBlueLight: '#1E40AF',
      primaryBlueDark: '#1E3A8A',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CF2027',
      info: '#003F87',
      textPrimary: '#003F87',
      textSecondary: '#374151',
      borderColor: '#CF2027',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#003F87', '#FFFFFF', '#CF2027', '#FCD116', '90deg'),
      overlay: createOverlay('#003F87', '#FFFFFF', '#CF2027', 0.75),
    },
  },
  
  // Cameroon - Green, Red, Yellow
  cameroon: {
    name: 'Cameroon',
    flag: '🇨🇲',
    colors: {
      primary: '#007A5E', // Green
      primaryLight: '#008751',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#007A5E',
      primaryBlueLight: '#008751',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#007A5E',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#007A5E',
      textPrimary: '#007A5E',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#007A5E', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#007A5E', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Equatorial Guinea - Green, White, Red, Blue
  'equatorial-guinea': {
    name: 'Equatorial Guinea',
    flag: '🇬🇶',
    colors: {
      primary: '#3E9A00', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      tertiary: '#003F87', // Blue triangle
      tertiaryLight: '#1E40AF',
      tertiaryDark: '#1E3A8A',
      primaryBlue: '#3E9A00',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#3E9A00',
      warning: '#F59E0B',
      error: '#CE1126',
      info: '#003F87',
      textPrimary: '#3E9A00',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#3E9A00', '#FFFFFF', '#CE1126', '#003F87', '90deg'),
      overlay: createOverlay('#3E9A00', '#FFFFFF', '#CE1126', 0.75),
    },
  },
  
  // Gabon - Green, Yellow, Blue
  gabon: {
    name: 'Gabon',
    flag: '🇬🇦',
    colors: {
      primary: '#009E60', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#003F87', // Blue
      secondaryLight: '#1E40AF',
      secondaryDark: '#1E3A8A',
      secondarySubtle: '#DBEAFE',
      primaryBlue: '#009E60',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#009E60',
      warning: '#FCD116',
      error: '#DC2626',
      info: '#003F87',
      textPrimary: '#009E60',
      textSecondary: '#374151',
      borderColor: '#003F87',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#009E60', '#FCD116', '#003F87', undefined, '90deg'),
      overlay: createOverlay('#009E60', '#FCD116', '#003F87', 0.75),
    },
  },
  
  // Congo - Green, Yellow, Red
  congo: {
    name: 'Congo',
    flag: '🇨🇬',
    colors: {
      primary: '#009543', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#009543',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#009543',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#009543',
      textPrimary: '#009543',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#009543', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#009543', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Central African Republic - Blue, White, Green, Yellow, Red
  'central-african-republic': {
    name: 'Central African Republic',
    flag: '🇨🇫',
    colors: {
      primary: '#003082', // Blue
      primaryLight: '#1E40AF',
      primaryDark: '#1E3A8A',
      primarySubtle: '#DBEAFE',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#FFFFFF', // White
      secondaryLight: '#FFFFFF',
      secondaryDark: '#F3F4F6',
      secondarySubtle: '#F9FAFB',
      tertiary: '#009639', // Green
      tertiaryLight: '#00A862',
      tertiaryDark: '#006B3F',
      primaryBlue: '#003082',
      primaryBlueLight: '#1E40AF',
      primaryBlueDark: '#1E3A8A',
      secondaryBlue: '#DBEAFE',
      success: '#009639',
      warning: '#FCD116',
      error: '#DC2626',
      info: '#003082',
      textPrimary: '#003082',
      textSecondary: '#374151',
      borderColor: '#FCD116',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#003082', '#FCD116', '#FFFFFF', '#009639', '90deg'),
      overlay: createOverlay('#003082', '#FCD116', '#009639', 0.75),
    },
  },
  
  // Chad - Blue, Yellow, Red
  chad: {
    name: 'Chad',
    flag: '🇹🇩',
    colors: {
      primary: '#002664', // Blue
      primaryLight: '#1E40AF',
      primaryDark: '#1E3A8A',
      primarySubtle: '#DBEAFE',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#002664',
      primaryBlueLight: '#1E40AF',
      primaryBlueDark: '#1E3A8A',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#002664',
      textPrimary: '#002664',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#002664', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#002664', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // São Tomé and Príncipe - Green, Yellow, Red
  'sao-tome-and-principe': {
    name: 'São Tomé and Príncipe',
    flag: '🇸🇹',
    colors: {
      primary: '#12AD2B', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#12AD2B',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#12AD2B',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#12AD2B',
      textPrimary: '#12AD2B',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#12AD2B', '#FCD116', '#CE1126', undefined, '90deg'),
      overlay: createOverlay('#12AD2B', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Kenya - Black, Red, Green with white stripes
  kenya: {
    name: 'Kenya',
    flag: '🇰🇪',
    colors: {
      primary: '#000000', // Black
      primaryLight: '#374151',
      primaryDark: '#000000',
      primarySubtle: '#F3F4F6',
      accent: '#DE2910', // Red
      accentLight: '#E63946',
      accentDark: '#A91D2A',
      accentSubtle: '#F8E8EA',
      secondary: '#006600', // Green
      secondaryLight: '#008751',
      secondaryDark: '#004D2E',
      secondarySubtle: '#E6F5ED',
      tertiary: '#FFFFFF', // White stripes
      tertiaryLight: '#FFFFFF',
      tertiaryDark: '#F3F4F6',
      primaryBlue: '#000000',
      primaryBlueLight: '#374151',
      primaryBlueDark: '#000000',
      secondaryBlue: '#F3F4F6',
      success: '#006600',
      warning: '#F59E0B',
      error: '#DE2910',
      info: '#000000',
      textPrimary: '#000000',
      textSecondary: '#374151',
      borderColor: '#DE2910',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#000000', '#FFFFFF', '#DE2910', '#006600', '90deg'),
      overlay: createOverlay('#000000', '#DE2910', '#006600', 0.75),
    },
  },
  
  // Tanzania - Green, Blue, Yellow, Black diagonal
  tanzania: {
    name: 'Tanzania',
    flag: '🇹🇿',
    colors: {
      primary: '#1EB53A', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#00A3DD', // Blue
      accentLight: '#3B82F6',
      accentDark: '#1E40AF',
      accentSubtle: '#DBEAFE',
      secondary: '#FCD116', // Yellow
      secondaryLight: '#FDE68A',
      secondaryDark: '#F59E0B',
      secondarySubtle: '#FFFBEB',
      tertiary: '#000000', // Black diagonal
      tertiaryLight: '#374151',
      tertiaryDark: '#111827',
      primaryBlue: '#1EB53A',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#1EB53A',
      warning: '#FCD116',
      error: '#DC2626',
      info: '#00A3DD',
      textPrimary: '#1EB53A',
      textSecondary: '#374151',
      borderColor: '#00A3DD',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#1EB53A', '#00A3DD', '#FCD116', '#000000', '135deg'),
      overlay: createOverlay('#1EB53A', '#00A3DD', '#FCD116', 0.70),
    },
  },
  
  // Uganda - Black, Yellow, Red stripes
  uganda: {
    name: 'Uganda',
    flag: '🇺🇬',
    colors: {
      primary: '#FCDD09', // Yellow
      primaryLight: '#FDE68A',
      primaryDark: '#F59E0B',
      primarySubtle: '#FFFBEB',
      accent: '#000000', // Black
      accentLight: '#374151',
      accentDark: '#111827',
      accentSubtle: '#F3F4F6',
      secondary: '#DA121A', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      primaryBlue: '#FCDD09',
      primaryBlueLight: '#FDE68A',
      primaryBlueDark: '#F59E0B',
      secondaryBlue: '#FFFBEB',
      success: '#006B3F',
      warning: '#FCDD09',
      error: '#DA121A',
      info: '#FCDD09',
      textPrimary: '#000000',
      textSecondary: '#374151',
      borderColor: '#DA121A',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#000000', '#FCDD09', '#DA121A', undefined, '90deg'),
      overlay: createOverlay('#000000', '#FCDD09', '#DA121A', 0.75),
    },
  },
  
  // Rwanda - Blue, Yellow, Green with sun
  rwanda: {
    name: 'Rwanda',
    flag: '🇷🇼',
    colors: {
      primary: '#20603D', // Green
      primaryLight: '#008751',
      primaryDark: '#004D2E',
      primarySubtle: '#E6F5ED',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#00A1DE', // Blue
      secondaryLight: '#3B82F6',
      secondaryDark: '#1E40AF',
      secondarySubtle: '#DBEAFE',
      tertiary: '#FFD700', // Gold sun
      tertiaryLight: '#FDE68A',
      tertiaryDark: '#F59E0B',
      primaryBlue: '#20603D',
      primaryBlueLight: '#008751',
      primaryBlueDark: '#004D2E',
      secondaryBlue: '#E6F5ED',
      success: '#20603D',
      warning: '#FCD116',
      error: '#DC2626',
      info: '#00A1DE',
      textPrimary: '#20603D',
      textSecondary: '#374151',
      borderColor: '#00A1DE',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#20603D', '#FCD116', '#00A1DE', '#FFD700', '90deg'),
      overlay: createOverlay('#20603D', '#FCD116', '#00A1DE', 0.70),
    },
  },
  
  // Burundi - Red, White, Green with stars
  burundi: {
    name: 'Burundi',
    flag: '🇧🇮',
    colors: {
      primary: '#18B637', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#FFFFFF', // White
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      tertiary: '#FFD700', // Gold stars
      tertiaryLight: '#FDE68A',
      tertiaryDark: '#F59E0B',
      primaryBlue: '#18B637',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#18B637',
      warning: '#F59E0B',
      error: '#CE1126',
      info: '#18B637',
      textPrimary: '#18B637',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#18B637', '#FFFFFF', '#CE1126', '#FFD700', '90deg'),
      overlay: createOverlay('#18B637', '#FFFFFF', '#CE1126', 0.75),
    },
  },
  
  // Ethiopia - Green, Yellow, Red with blue disc
  ethiopia: {
    name: 'Ethiopia',
    flag: '🇪🇹',
    colors: {
      primary: '#078930', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#DA121A', // Red
      accentLight: '#E63946',
      accentDark: '#A91D2A',
      accentSubtle: '#F8E8EA',
      secondary: '#FCDD09', // Yellow
      secondaryLight: '#FDE68A',
      secondaryDark: '#F59E0B',
      secondarySubtle: '#FFFBEB',
      tertiary: '#0033A0', // Blue disc
      tertiaryLight: '#1E40AF',
      tertiaryDark: '#1E3A8A',
      primaryBlue: '#078930',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#078930',
      warning: '#FCDD09',
      error: '#DA121A',
      info: '#0033A0',
      textPrimary: '#078930',
      textSecondary: '#374151',
      borderColor: '#DA121A',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#078930', '#FCDD09', '#DA121A', '#0033A0', '90deg'),
      overlay: createOverlay('#078930', '#FCDD09', '#DA121A', 0.75),
    },
  },
  
  // Eritrea - Green, Red, Blue triangle
  eritrea: {
    name: 'Eritrea',
    flag: '🇪🇷',
    colors: {
      primary: '#3E9A00', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#CE1126', // Red
      accentLight: '#E63946',
      accentDark: '#A91D2A',
      accentSubtle: '#F8E8EA',
      secondary: '#4189DD', // Blue
      secondaryLight: '#60A5FA',
      secondaryDark: '#2563EB',
      secondarySubtle: '#DBEAFE',
      tertiary: '#FFD700', // Gold wreath
      tertiaryLight: '#FDE68A',
      tertiaryDark: '#F59E0B',
      primaryBlue: '#3E9A00',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#3E9A00',
      warning: '#F59E0B',
      error: '#CE1126',
      info: '#4189DD',
      textPrimary: '#3E9A00',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#3E9A00', '#CE1126', '#4189DD', '#FFD700', '135deg'),
      overlay: createOverlay('#3E9A00', '#CE1126', '#4189DD', 0.70),
    },
  },
  
  // Djibouti - Blue, Green, White triangle
  djibouti: {
    name: 'Djibouti',
    flag: '🇩🇯',
    colors: {
      primary: '#6AB2E7', // Light Blue
      primaryLight: '#93C5FD',
      primaryDark: '#3B82F6',
      primarySubtle: '#DBEAFE',
      accent: '#12AD2B', // Green
      accentLight: '#00A862',
      accentDark: '#006B3F',
      accentSubtle: '#E6F5ED',
      secondary: '#FFFFFF', // White
      secondaryLight: '#FFFFFF',
      secondaryDark: '#F3F4F6',
      secondarySubtle: '#F9FAFB',
      tertiary: '#CE1126', // Red star
      tertiaryLight: '#E63946',
      tertiaryDark: '#A91D2A',
      primaryBlue: '#6AB2E7',
      primaryBlueLight: '#93C5FD',
      primaryBlueDark: '#3B82F6',
      secondaryBlue: '#DBEAFE',
      success: '#12AD2B',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#6AB2E7',
      textPrimary: '#1E3A8A',
      textSecondary: '#374151',
      borderColor: '#12AD2B',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#6AB2E7', '#12AD2B', '#FFFFFF', '#CE1126', '135deg'),
      overlay: createOverlay('#6AB2E7', '#12AD2B', '#FFFFFF', 0.75),
    },
  },
  
  // Somalia - Light Blue with white star
  somalia: {
    name: 'Somalia',
    flag: '🇸🇴',
    colors: {
      primary: '#4189DD', // Light Blue
      primaryLight: '#60A5FA',
      primaryDark: '#2563EB',
      primarySubtle: '#DBEAFE',
      accent: '#FFFFFF', // White star
      accentLight: '#FFFFFF',
      accentDark: '#F3F4F6',
      accentSubtle: '#F9FAFB',
      secondary: '#4189DD', // Same as primary
      secondaryLight: '#60A5FA',
      secondaryDark: '#2563EB',
      secondarySubtle: '#DBEAFE',
      primaryBlue: '#4189DD',
      primaryBlueLight: '#60A5FA',
      primaryBlueDark: '#2563EB',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#F59E0B',
      error: '#DC2626',
      info: '#4189DD',
      textPrimary: '#1E3A8A',
      textSecondary: '#374151',
      borderColor: '#4189DD',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#4189DD', '#FFFFFF', '#4189DD', undefined, 'radial-gradient(circle, #FFFFFF 0%, #4189DD 100%)'),
      overlay: createOverlay('#4189DD', '#FFFFFF', undefined, 0.80),
    },
  },
  
  // South Sudan - Black, Red, Green, Blue, Yellow
  'south-sudan': {
    name: 'South Sudan',
    flag: '🇸🇸',
    colors: {
      primary: '#078930', // Green
      primaryLight: '#00A862',
      primaryDark: '#006B3F',
      primarySubtle: '#E6F5ED',
      accent: '#CE1126', // Red
      accentLight: '#E63946',
      accentDark: '#A91D2A',
      accentSubtle: '#F8E8EA',
      secondary: '#000000', // Black
      secondaryLight: '#374151',
      secondaryDark: '#111827',
      secondarySubtle: '#F3F4F6',
      tertiary: '#0033A0', // Blue triangle
      tertiaryLight: '#1E40AF',
      tertiaryDark: '#1E3A8A',
      primaryBlue: '#078930',
      primaryBlueLight: '#00A862',
      primaryBlueDark: '#006B3F',
      secondaryBlue: '#E6F5ED',
      success: '#078930',
      warning: '#F59E0B',
      error: '#CE1126',
      info: '#0033A0',
      textPrimary: '#078930',
      textSecondary: '#374151',
      borderColor: '#CE1126',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#000000', '#FFFFFF', '#CE1126', '#078930', '90deg'),
      overlay: createOverlay('#000000', '#CE1126', '#078930', 0.75),
    },
  },
  
  // Madagascar - White, Red, Green
  madagascar: {
    name: 'Madagascar',
    flag: '🇲🇬',
    colors: {
      primary: '#FC3D32', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#007E3A', // Green
      accentLight: '#00A862',
      accentDark: '#006B3F',
      accentSubtle: '#E6F5ED',
      secondary: '#FFFFFF', // White
      secondaryLight: '#FFFFFF',
      secondaryDark: '#F3F4F6',
      secondarySubtle: '#F9FAFB',
      primaryBlue: '#FC3D32',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#007E3A',
      warning: '#F59E0B',
      error: '#FC3D32',
      info: '#FC3D32',
      textPrimary: '#FC3D32',
      textSecondary: '#374151',
      borderColor: '#007E3A',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#FFFFFF', '#FC3D32', '#007E3A', undefined, '90deg'),
      overlay: createOverlay('#FC3D32', '#007E3A', '#FFFFFF', 0.75),
    },
  },
  
  // Seychelles - Blue, Yellow, Red, White, Green diagonal
  seychelles: {
    name: 'Seychelles',
    flag: '🇸🇨',
    colors: {
      primary: '#003F87', // Blue
      primaryLight: '#1E40AF',
      primaryDark: '#1E3A8A',
      primarySubtle: '#DBEAFE',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      tertiary: '#FFFFFF', // White
      tertiaryLight: '#FFFFFF',
      tertiaryDark: '#F3F4F6',
      primaryBlue: '#003F87',
      primaryBlueLight: '#1E40AF',
      primaryBlueDark: '#1E3A8A',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#003F87',
      textPrimary: '#003F87',
      textSecondary: '#374151',
      borderColor: '#FCD116',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#003F87', '#FCD116', '#FFFFFF', '#CE1126', '135deg'),
      overlay: createOverlay('#003F87', '#FCD116', '#CE1126', 0.70),
    },
  },
  
  // Comoros - Yellow, White, Red, Blue, Green
  comoros: {
    name: 'Comoros',
    flag: '🇰🇲',
    colors: {
      primary: '#3A75C4', // Blue
      primaryLight: '#60A5FA',
      primaryDark: '#2563EB',
      primarySubtle: '#DBEAFE',
      accent: '#FCD116', // Yellow
      accentLight: '#FDE68A',
      accentDark: '#F59E0B',
      accentSubtle: '#FFFBEB',
      secondary: '#CE1126', // Red
      secondaryLight: '#E63946',
      secondaryDark: '#A91D2A',
      secondarySubtle: '#F8E8EA',
      tertiary: '#FFFFFF', // White
      tertiaryLight: '#FFFFFF',
      tertiaryDark: '#F3F4F6',
      primaryBlue: '#3A75C4',
      primaryBlueLight: '#60A5FA',
      primaryBlueDark: '#2563EB',
      secondaryBlue: '#DBEAFE',
      success: '#006B3F',
      warning: '#FCD116',
      error: '#CE1126',
      info: '#3A75C4',
      textPrimary: '#3A75C4',
      textSecondary: '#374151',
      borderColor: '#FCD116',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#3A75C4', '#FCD116', '#FFFFFF', '#CE1126', '90deg'),
      overlay: createOverlay('#3A75C4', '#FCD116', '#CE1126', 0.75),
    },
  },
  
  // Mauritius - Red, Blue, Yellow, Green
  mauritius: {
    name: 'Mauritius',
    flag: '🇲🇺',
    colors: {
      primary: '#EA2839', // Red
      primaryLight: '#E63946',
      primaryDark: '#A91D2A',
      primarySubtle: '#F8E8EA',
      accent: '#1A206D', // Blue
      accentLight: '#1E40AF',
      accentDark: '#1E3A8A',
      accentSubtle: '#DBEAFE',
      secondary: '#FFD500', // Yellow
      secondaryLight: '#FDE68A',
      secondaryDark: '#F59E0B',
      secondarySubtle: '#FFFBEB',
      tertiary: '#00A551', // Green
      tertiaryLight: '#00A862',
      tertiaryDark: '#006B3F',
      primaryBlue: '#EA2839',
      primaryBlueLight: '#E63946',
      primaryBlueDark: '#A91D2A',
      secondaryBlue: '#F8E8EA',
      success: '#00A551',
      warning: '#FFD500',
      error: '#EA2839',
      info: '#1A206D',
      textPrimary: '#EA2839',
      textSecondary: '#374151',
      borderColor: '#1A206D',
      cardBackground: '#FFFFFF',
    },
    background: {
      type: 'gradient',
      gradient: createFlagGradient('#EA2839', '#1A206D', '#FFD500', '#00A551', '90deg'),
      overlay: createOverlay('#EA2839', '#1A206D', '#FFD500', 0.75),
    },
  },
};

// Export countryThemes for use in components
export { countryThemes };

interface ThemeContextType {
  currentTheme: CountryTheme;
  themeConfig: CountryThemeConfig;
  setTheme: (theme: CountryTheme) => void;
  availableThemes: CountryTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'scc-country-theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<CountryTheme>(() => {
    // Load from localStorage or default to Ghana
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as CountryTheme;
    return savedTheme && savedTheme in countryThemes ? savedTheme : 'ghana';
  });

  const setTheme = (theme: CountryTheme) => {
    setCurrentThemeState(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
  };

  const applyTheme = (theme: CountryTheme) => {
    const config = countryThemes[theme];
    const root = document.documentElement;
    const colors = config.colors;
    const background = config.background;

    // Apply comprehensive CSS variables for colors
    root.style.setProperty('--primary-red', colors.primary);
    root.style.setProperty('--primary-red-light', colors.primaryLight);
    root.style.setProperty('--primary-red-dark', colors.primaryDark);
    root.style.setProperty('--primary-red-subtle', colors.primarySubtle);
    
    root.style.setProperty('--accent-gold', colors.accent);
    root.style.setProperty('--accent-gold-light', colors.accentLight);
    root.style.setProperty('--accent-gold-dark', colors.accentDark);
    root.style.setProperty('--accent-gold-subtle', colors.accentSubtle);
    
    root.style.setProperty('--secondary-green', colors.secondary);
    root.style.setProperty('--secondary-green-light', colors.secondaryLight);
    root.style.setProperty('--secondary-green-dark', colors.secondaryDark);
    root.style.setProperty('--secondary-green-subtle', colors.secondarySubtle);
    
    // Tertiary colors if available
    if (colors.tertiary) {
      root.style.setProperty('--tertiary-color', colors.tertiary);
      root.style.setProperty('--tertiary-color-light', colors.tertiaryLight || colors.tertiary);
      root.style.setProperty('--tertiary-color-dark', colors.tertiaryDark || colors.tertiary);
    }
    
    // Legacy aliases
    root.style.setProperty('--primary-blue', colors.primaryBlue);
    root.style.setProperty('--primary-blue-light', colors.primaryBlueLight);
    root.style.setProperty('--primary-blue-dark', colors.primaryBlueDark);
    root.style.setProperty('--secondary-blue', colors.secondaryBlue);
    
    // Status colors
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--error', colors.error);
    root.style.setProperty('--info', colors.info);
    
    // Text and UI colors
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--border-color', colors.borderColor);
    root.style.setProperty('--card-background', colors.cardBackground);

    // Apply background
    // For Ghana: use image, for others: use gradient only
    if (background.type === 'image' && background.image) {
      // Ghana: Use the image as background on all pages
      const imageUrl = `url('${background.image}')`;
      root.style.setProperty('--background-image', imageUrl);
      root.style.setProperty('--background-gradient', imageUrl);
    } else {
      // Other countries: Use gradient based on flag colors
      root.style.setProperty('--background-image', 'none');
      root.style.setProperty('--background-gradient', background.gradient);
    }
    root.style.setProperty('--background-overlay', background.overlay);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Get all available themes and sort them (Ghana first, then alphabetically)
  const allThemes = Object.keys(countryThemes) as CountryTheme[];
  const sortedThemes = allThemes.sort((a, b) => {
    if (a === 'ghana') return -1;
    if (b === 'ghana') return 1;
    return countryThemes[a].name.localeCompare(countryThemes[b].name);
  });

  const value: ThemeContextType = {
    currentTheme,
    themeConfig: countryThemes[currentTheme],
    setTheme,
    availableThemes: sortedThemes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
