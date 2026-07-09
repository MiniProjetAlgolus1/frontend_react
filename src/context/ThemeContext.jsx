import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Au démarrage : lit le thème sauvegardé, ou "dark" par défaut
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // À chaque changement de thème : applique la classe sur <html> et sauvegarde
  useEffect(() => {
    const root = document.documentElement; // = la balise <html>
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
