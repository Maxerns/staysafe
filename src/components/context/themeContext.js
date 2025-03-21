import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define light theme colors
const lightTheme = {
  primary: "#122f76",
  background: "#f8f9fa",
  card: "#FFFFFF",
  text: "#212121",
  border: "#E0E0E0",
  notification: "#FF3B3B",
  error: "#ff3b3b",
  success: "#4CAF50",
  warning: "#FF9800",
  info: "#2196F3",
  accent: "#ff3b3b",
  inactive: "#757575",
  buttonText: "#FFFFFF",
  headerBackground: "#122f76",
  headerText: "#FFFFFF",
  drawerBackground: "#f8f9fa",
  drawerHeaderBackground: "#122f76",
  inputBackground: "#FFFFFF",
};

// Define dark theme colors
const darkTheme = {
  primary: "#1a56d6",
  background: "#121212",
  card: "#1E1E1E",
  text: "#E1E1E1",
  border: "#333333",
  notification: "#FF5252",
  error: "#CF6679",
  success: "#81C784",
  warning: "#FFB74D",
  info: "#64B5F6",
  accent: "#FF5252",
  inactive: "#9E9E9E",
  buttonText: "#FFFFFF",
  headerBackground: "#1a1a2e",
  headerText: "#FFFFFF",
  drawerBackground: "#121212",
  drawerHeaderBackground: "#1a1a2e",
  inputBackground: "#2C2C2C",
};

// Create the theme context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialisations ---------------------------------

  // Check system preference
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  const [isLoading, setIsLoading] = useState(true);
  // State -------------------------------------------

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("isDarkMode");
        if (savedTheme !== null) {
          const isDark = savedTheme === "true";
          setIsDarkMode(isDark);
          setTheme(isDark ? darkTheme : lightTheme);
        } else {
          // Use system preference if no saved preference
          setIsDarkMode(systemColorScheme === "dark");
          setTheme(systemColorScheme === "dark" ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  // Toggle theme function
  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? darkTheme : lightTheme);

    // Save theme preference
    try {
      await AsyncStorage.setItem("isDarkMode", newMode.toString());
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  // View --------------------------------------------
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
