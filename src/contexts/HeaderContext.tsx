import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HeaderConfig {
  showBackButton?: boolean;
  title?: string;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}

interface HeaderContextType {
  headerConfig: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [headerConfig, setConfig] = useState<HeaderConfig>({
    showBackButton: false,
    title: undefined,
    rightIcon: undefined,
    onRightClick: undefined,
  });

  const setHeaderConfig = useCallback((config: HeaderConfig) => {
    setConfig(config);
  }, []);

  return (
    <HeaderContext.Provider value={{ headerConfig, setHeaderConfig }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
