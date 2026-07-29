import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UIContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  apiToken?: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const apiToken = import.meta.env.VITE_DATABURSATIL_TOKEN || 'token_no_proporcionado';

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

    return (
    <UIContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu, apiToken, theme, toggleTheme }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined || context === null) {
    throw new Error('useUI debe ser usado dentro de un UIProvider');
  }
  return context;
}
