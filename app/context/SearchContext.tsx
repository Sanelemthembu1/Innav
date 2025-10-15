import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  location: string;
  setLocation: (loc: string) => void;
  showDestination: boolean;
  setShowDestination: (show: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState('');
  const [showDestination, setShowDestination] = useState(false);
  return (
    <SearchContext.Provider value={{ location, setLocation, showDestination, setShowDestination }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};
