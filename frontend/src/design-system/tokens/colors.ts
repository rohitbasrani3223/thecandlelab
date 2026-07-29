export const colors = {
  ivory: {
    50: '#FCFAF7',
    100: '#FAF6F0',
    200: '#F5EEE4',
    300: '#EFE4D3',
  },
  cream: {
    50: '#F9F7F2',
    100: '#F4EFE6',
    200: '#EBE2D3',
    300: '#DFD2BD',
  },
  beige: {
    100: '#F3EBDD',
    200: '#E5D9C5',
    300: '#D4C3AA',
    400: '#C2AE90',
  },
  brown: {
    500: '#A68B75',
    600: '#8C7A6B',
    700: '#69574A',
    800: '#4A3B32',
    900: '#2A1E17',
    950: '#1C130E',
  },
  gold: {
    300: '#F5E6A3',
    400: '#E6CA65',
    500: '#D4AF37',
    600: '#C5A059',
    700: '#A38038',
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
    gold: 'linear-gradient(135deg, #E6CA65 0%, #D4AF37 50%, #C5A059 100%)',
    espresso: 'linear-gradient(135deg, #4A3B32 0%, #2A1E17 100%)',
    ivoryGlow: 'linear-gradient(180deg, #FAF6F0 0%, #F4EFE6 100%)',
    shimmer: 'linear-gradient(90deg, #EBE2D3 25%, #FCFAF7 50%, #EBE2D3 75%)',
  },
} as const;

export type ColorToken = typeof colors;
