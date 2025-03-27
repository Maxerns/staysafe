import { Text } from "react-native";
import Selector from "./Selector";
import { Ionicons } from "@expo/vector-icons";

const Favourite = ({ isFavorite, onSelect, style }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Selector onPress={onSelect} style={style}>
      <Text> 
        {isFavorite ? 
          <Ionicons name="heart" size={20} color="crimson" /> : 
          <Ionicons name="heart-outline" size={20} color="grey" />} 
      </Text>
    </Selector>
  );
};

export default Favourite;
