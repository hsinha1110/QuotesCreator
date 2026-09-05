export const COLORS = {
  primary: '#3B1C85',
  secondary: '#170E49',
  accent: '#7A45D0',

  white: '#FFFFFF',
  black: '#222222',

  grey: '#CFCFCF',
  light_grey: '#ECE7F1',

  red: '#E53935',

  textPrimary: '#FFFFFF',
  textSecondary: '#C8C0DF',

  dotInactive: '#FFFFFF',
};

export const THEME_COLORS = {
  light: {
    primary: '#3B1C85',
    secondary: '#170E49',
    accent: '#7A45D0',

    white: '#FFFFFF',
    black: '#222222',
    grey: '#CFCFCF',
    light_grey: '#ECE7F1',
    red: '#E53935',

    textPrimary: '#222222',
    textSecondary: '#666666',
    dotInactive: '#CFCFCF',

    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#ECE7F1',

    // Input
    inputBackground: '#FFFFFF',
    inputBorder: '#DDDDDD',
    placeholder: '#999999',
    iconSecondary: '#777777',
  },

  dark: {
    primary: '#7A45D0',
    secondary: '#170E49',
    accent: '#9B6BE8',

    white: '#FFFFFF',
    black: '#FFFFFF',
    grey: '#777777',
    light_grey: '#292433',
    red: '#EF5350',

    textPrimary: '#FFFFFF',
    textSecondary: '#C8C0DF',
    dotInactive: '#777777',

    background: '#12101A',
    card: '#1C1826',
    border: '#302A3D',

    // Input
    inputBackground: '#1C1826',
    inputBorder: '#3A3545',
    placeholder: '#777783',
    iconSecondary: '#A8A8B3',
  },
};

export type ThemeColors = typeof THEME_COLORS.light;

export default COLORS;
