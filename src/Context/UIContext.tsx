import { createContext, useState, useContext, ReactNode } from 'react';

interface UIContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  apiToken?: string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const apiToken = import.meta.env.VITE_DATABURSATIL_TOKEN || 'token_no_proporcionado';

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

    return (
    <UIContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu, apiToken }}>
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
