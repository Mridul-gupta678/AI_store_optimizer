"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface StoreContextType {
  shopDomain: string | null;
  connectStore: (domain: string) => void;
  disconnectStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [shopDomain, setShopDomain] = useState<string | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem('kasparo_shop_domain');
    if (saved) {
      setShopDomain(saved);
    }
  }, []);

  const connectStore = (domain: string) => {
    let cleanDomain = domain.trim().toLowerCase();
    
    // Auto-format common URL mistakes
    if (cleanDomain.startsWith('http://')) cleanDomain = cleanDomain.replace('http://', '');
    if (cleanDomain.startsWith('https://')) cleanDomain = cleanDomain.replace('https://', '');
    if (cleanDomain.startsWith('www.')) cleanDomain = cleanDomain.replace('www.', '');
    if (cleanDomain.endsWith('/')) cleanDomain = cleanDomain.slice(0, -1);
    
    setShopDomain(cleanDomain);
    localStorage.setItem('kasparo_shop_domain', cleanDomain);
  };

  const disconnectStore = () => {
    setShopDomain(null);
    localStorage.removeItem('kasparo_shop_domain');
  };

  return (
    <StoreContext.Provider value={{ shopDomain, connectStore, disconnectStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
