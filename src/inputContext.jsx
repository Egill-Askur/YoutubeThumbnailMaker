// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';

// Create context
const InputContext = createContext();

// Provider component
export const InputProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  return (
    <InputContext.Provider value={{ inputValue, setInputValue, inputValue2, setInputValue2 }}>
      {children}
    </InputContext.Provider>
  );
};

// Custom hook to use the context
export const useInput = () => useContext(InputContext);