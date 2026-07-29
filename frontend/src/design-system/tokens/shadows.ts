export const shadows = {
  none: 'none',
  subtle: '0 2px 10px rgba(42, 30, 23, 0.04)',
  sm: '0 1px 3px rgba(42, 30, 23, 0.05)',
  card: '0 4px 20px rgba(42, 30, 23, 0.06), 0 1px 3px rgba(42, 30, 23, 0.03)',
  hover: '0 12px 30px rgba(42, 30, 23, 0.12), 0 4px 10px rgba(42, 30, 23, 0.05)',
  goldGlow: '0 0 25px rgba(212, 175, 55, 0.35)',
  modal: '0 20px 50px rgba(28, 19, 14, 0.25)',
  drawer: '-10px 0 40px rgba(28, 19, 14, 0.18)',
  innerSubtle: 'inset 0 2px 4px 0 rgba(42, 30, 23, 0.06)',
} as const;

export type ShadowToken = typeof shadows;
