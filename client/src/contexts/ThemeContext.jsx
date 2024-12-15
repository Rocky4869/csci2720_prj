import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Context for the Theme
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => {
  return useContext(ThemeContext);
};

// ThemeContext Provider Component
export const ThemeProvider = ({ children }) => {
  // Get the initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Sync theme changes with localStorage and apply the 'dark' class
  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("theme", theme);

    // Apply or remove the 'dark' class on the <html> element
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};