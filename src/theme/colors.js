const palette = {
  bluePrimary: '#3576E0',
  white: '#FFFFFF',
  black: '#111827',
  gray100: '#F3F4F6',
  gray800: '#1F2937',
  gray900: '#111827',
  gray400: '#9CA3AF',
  grayBorder: '#E5E7EB',
  grayBorderDark: '#374151'
};

export const THEME = {
  light: {
    background: palette.white,
    text: palette.black,
    textSecondary: palette.gray800,
    inputBackground: palette.gray100,
    inputPlaceholder: palette.gray400,
    border: palette.grayBorder,
    primary: palette.bluePrimary,
    card: palette.white,
  },
  dark: {
    background: palette.gray900,
    text: palette.white,
    textSecondary: palette.gray400,
    inputBackground: palette.gray800,
    inputPlaceholder: palette.gray400,
    border: palette.grayBorderDark,
    primary: palette.bluePrimary,
    card: palette.gray800,
  }
};