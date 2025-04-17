import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark'; // system modunda bile gerçek aktif tema
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Sistem temasını dinle
  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const applyResolvedTheme = () => {
      const active = theme === 'system'
        ? (matchMedia.matches ? 'dark' : 'light')
        : theme;

      setResolvedTheme(active);
      document.documentElement.classList.toggle('dark', active === 'dark');
    };

    applyResolvedTheme();

    if (theme === 'system') {
      matchMedia.addEventListener('change', applyResolvedTheme);
      return () => matchMedia.removeEventListener('change', applyResolvedTheme);
    }
  }, [theme]);

  // İlk açılışta localStorage kontrolü
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};