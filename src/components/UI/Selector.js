import { Pressable } from "react-native";

const Selector = ({ children, onPress, style, pressedStyle }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const handlePress = () => {
    onPress();
  };

  // View --------------------------------------------
  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handlePress}
      style={({ pressed }) => [style, pressed && pressedStyle]}
    >
      {children}
    </Pressable>
  );
};

export default Selector;
