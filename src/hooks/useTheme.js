import { useColorScheme } from 'react-native';
import { THEME } from '../theme/colors';

export const useTheme = () => {
  const scheme = useColorScheme();
  
  const currentTheme = scheme === 'dark' ? THEME.dark : THEME.light;

  return {
    colors: currentTheme,
    isDark: scheme === 'dark'
  };
};