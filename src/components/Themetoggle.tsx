// src/components/ThemeToggle.tsx
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 border rounded"
    >
      Toggle {darkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
};
