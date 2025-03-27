import { StyleSheet, Text, View } from "react-native";
import Selector from "./Selector";
import { useTheme } from "../context/themeContext";

export const Button = ({ label, icon, onClick, styleLabel, styleButton, disabled }) => {
  // Initialisations ---------------------------------
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  
  // Determine text color based on button background
  // If using primary background, use buttonText color
  const isPrimaryButton = styleButton && (
    styleButton.backgroundColor === theme.primary || 
    styleButton.backgroundColor === theme.accent ||
    styleButton.backgroundColor === theme.error ||
    styleButton.backgroundColor === theme.info ||
    styleButton.backgroundColor === theme.success ||
    styleButton.backgroundColor === theme.warning
  );
  
  const textColor = isPrimaryButton ? theme.buttonText : theme.text;
  
  return (
    <Selector
      onPress={onClick}
      style={[styles.button, styleButton, disabled && styles.disabledButton]}
      pressedStyle={[styles.pressedButton, styleButton && { opacity: 0.85 }]}
      disabled={disabled}
    >
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text style={[styles.label, { color: textColor }, styleLabel]}>{label}</Text>
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
  disabledButton: {
    opacity: 0.5,
  },
});