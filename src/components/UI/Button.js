import React from "react"; // added to support cloneElement
import { StyleSheet, Text, View } from "react-native";
import Selector from "./Selector";
import { useTheme } from "../context/themeContext";

export const Button = ({ label, icon, onClick, styleLabel, styleButton, primary }) => {
  // Retrieve theme from context
  const { theme } = useTheme();
  // Determine background based on primary flag
  const backgroundColor = primary ? theme.primary : theme.card;
  // Use theme text color for button text
  const labelColor = theme.text;
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Selector
      onPress={onClick}
      style={[
        styles.button,
        styleButton,
        { backgroundColor } // apply dynamic background color
      ]}
      pressedStyle={[
        styles.pressedButton,
        styleButton && { opacity: 0.85 },
        { backgroundColor } // apply dynamic background color on press
      ]}
    >
      {icon ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, { color: theme.text })}
        </View>
      ) : null}
      <Text style={[styles.label, { color: labelColor }, styleLabel]}>{label}</Text>
    </Selector>
  );
};

export const ButtonTray = ({ children, style }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return <View style={[styles.buttonTray, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  buttonTray: {
    flexDirection: "row",
    gap: 15,
    marginTop: 10,
  },
  button: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#ddd",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  pressedButton: {
    backgroundColor: "#f8f9fa",
    elevation: 1,
  },
});
