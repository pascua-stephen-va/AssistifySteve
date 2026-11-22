import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types/index.ts';

interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark') return 'dark';
    if (stored === 'light') return 'light';
    return prefersDark ? 'dark' : 'light';
  });

  // Apply theme class to document root with Material 3 Expressive transition
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (withTransition = false) => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (withTransition) {
        root.classList.add('theme-transition');
        const timer = setTimeout(() => {
          root.classList.remove('theme-transition');
        }, 450);
        return () => clearTimeout(timer);
      }

      setEffectiveTheme(isDark ? 'dark' : 'light');
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Immediate initial sync (no transition delay on mount)
    applyTheme(false);

    // Listen for OS scheme change if in auto/system mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme(true);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    // Add transition before applying new theme state
    const root = document.documentElement;
    root.classList.add('theme-transition');
    window.clearTimeout((window as unknown as { _themeTransitionTimer?: number })._themeTransitionTimer);
    (window as unknown as { _themeTransitionTimer?: number })._themeTransitionTimer = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 450);

    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
