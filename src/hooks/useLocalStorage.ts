import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Obter valor do localStorage ou usar valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      
      // Tentar JSON.parse primeiro, se falhar, usar como string
      try {
        return JSON.parse(item);
      } catch {
        // Se não conseguir fazer parse, provavelmente é uma string simples
        return item as T;
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}