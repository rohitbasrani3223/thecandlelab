export const colors = {
  ivory: {
    50: '#FDFBF8',
    100: '#FAF6F0',
    200: '#F5EEE4',
    300: '#EFE4D3',
  },
  cream: {
    50: '#FAF7F2',
    100: '#F4EFE6',
    200: '#EBE2D3',
    300: '#DFD2BD',
  },
  beige: {
    100: '#F3EBDD',
    200: '#E5DAC7',
    300: '#D6C7AF',
    400: '#C2AE90',
  },
  brown: {
    500: '#A28B77',
    600: '#847262',
    700: '#5E4E42',
    800: '#3E3027',
    900: '#241812',
    950: '#180F0A',
  },
  gold: {
    300: '#F3E4A0',
    400: '#DEB554',
    500: '#C5983A',
    600: '#A87D29',
    700: '#8C651F',
  },
  terracotta: {
    soft: '#F9ECE7',
    DEFAULT: '#BA6648',
    dark: '#964B31',
  },
  sage: {
    soft: '#EEF3ED',
    DEFAULT: '#6B7B69',
    dark: '#4D5B4B',
  },
  status: {
    success: {
      bg: '#EAF5ED',
      text: '#2E6F40',
      border: '#A8D9B4',
    },
    warning: {
      bg: '#FDF5E6',
      text: '#C87D20',
      border: '#F7D49B',
    },
    error: {
      bg: '#FDF0F0',
      text: '#B33A3A',
      border: '#F4B8B8',
    },
    info: {
      bg: '#EBF3FA',
      text: '#2B6CB0',
      border: '#B3D4F5',
    },
  },
  gradients: {
    gold: 'linear-gradient(135deg, #DEB554 0%, #C5983A 50%, #A87D29 100%)',
    espresso: 'linear-gradient(135deg, #3E3027 0%, #241812 100%)',
    ivoryGlow: 'linear-gradient(180deg, #FAF6F0 0%, #F4EFE6 100%)',
    shimmer: 'linear-gradient(90deg, #EBE2D3 25%, #FDFBF8 50%, #EBE2D3 75%)',
    warmTerracotta: 'linear-gradient(135deg, #F9ECE7 0%, #FAF6F0 100%)',
    botanicalSage: 'linear-gradient(135deg, #EEF3ED 0%, #FAF6F0 100%)',
  },
} as const;

export type ColorToken = typeof colors;
