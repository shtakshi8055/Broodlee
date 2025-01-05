'use client'
import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [chartType, setChartType] = useState('Pie'); // Default is Pie chart

  return (
    <SettingsContext.Provider value={{ chartType, setChartType }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
