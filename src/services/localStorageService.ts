// src/services/localStorageService.ts
export const getItem = (key: string): any | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Errore nel recuperare ${key} da localStorage:`, error);
    return null;
  }
};

export const setItem = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Errore nel salvare ${key} in localStorage:`, error);
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Errore nel rimuovere ${key} da localStorage:`, error);
  }
};
