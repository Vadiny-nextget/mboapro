import { useCallback, useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\u2019intérieur de <ThemeProvider>');
  }
  return context;
}

// Petit hook utilitaire si on veut juste basculer sans lire l'état complet
export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  return useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);
}