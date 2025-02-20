import { Pressable } from "react-native";
import * as Haptics from 'expo-haptics';

const Selector = ({ children, onPress, style, pressedStyle }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
