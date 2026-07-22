import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('flowdo-accent');
    return saved || '#6366F1';
  });

  useEffect(() => {
    localStorage.setItem('flowdo-accent', accentColor);
    document.documentElement.style.setProperty('--color-primary', accentColor);
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
