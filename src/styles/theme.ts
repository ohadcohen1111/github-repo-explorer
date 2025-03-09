import { DefaultTheme } from 'styled-components';

// Define theme type
export interface ThemeColors {
  primary: string;
  secondary: string;
  border: string;
  background: string;
  backgroundSecondary: string;
  text: string;
  lightText: string;
  danger: string;
  success: string;
  cardBackground: string;
  headerBackground: string;
}

// Extend the DefaultTheme interface from styled-components
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ThemeColors;
    isDark: boolean;
  }
}

// Light theme
export const lightTheme: DefaultTheme = {
  isDark: false,
  colors: {
    primary: '#0366d6',
    secondary: '#586069',
    border: '#e1e4e8',
    background: '#ffffff',
    backgroundSecondary: '#f6f8fa',
    text: '#24292e',
    lightText: '#6a737d',
    danger: '#d73a49',
    success: '#2cbe4e',
    cardBackground: '#ffffff',
    headerBackground: '#f6f8fa'
  }
};

// Dark theme
export const darkTheme: DefaultTheme = {
  isDark: true,
  colors: {
    primary: '#58a6ff',
    secondary: '#8b949e',
    border: '#30363d',
    background: '#0d1117',
    backgroundSecondary: '#161b22',
    text: '#c9d1d9',
    lightText: '#8b949e',
    danger: '#f85149',
    success: '#56d364',
    cardBackground: '#161b22',
    headerBackground: '#0d1117'
  }
};