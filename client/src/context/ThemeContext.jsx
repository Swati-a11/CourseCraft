import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Fallback check on userSettings in localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.darkMode === false) return 'light';
      } catch (e) {}
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.className = 'bg-white text-slate-950 transition-colors duration-300';
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.className = 'bg-black text-white transition-colors duration-300';
    }
    localStorage.setItem('theme', theme);
    
    // Sync settings in localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        parsed.darkMode = theme === 'dark';
        localStorage.setItem('userSettings', JSON.stringify(parsed));
      } catch (e) {}
    } else {
      localStorage.setItem('userSettings', JSON.stringify({ darkMode: theme === 'dark' }));
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
