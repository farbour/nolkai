import React, { createContext, useContext, useState } from 'react';
import { brands, defaultBrand } from '../config/brands';

interface BrandContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  availableBrands: string[];
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [selectedBrand, setSelectedBrand] = useState(defaultBrand);

  const value = {
    selectedBrand,
    setSelectedBrand,
    availableBrands: brands,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}