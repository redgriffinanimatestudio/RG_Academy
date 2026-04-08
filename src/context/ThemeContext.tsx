import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark'; // Forced dark mode

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize as dark
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    localStorage.setItem('rg-theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Add transition class to body to prevent flash on load
    document.body.classList.add('theme-transitioning');
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = () => {
    // No-op to prevent light mode switching
    console.log(`[Theme] System is locked to Dark Mode for industrial consistency.`);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
