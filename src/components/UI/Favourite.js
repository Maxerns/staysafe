import { Text } from "react-native";
import Icons from "./Icons";
import Selector from "./Selector";

const Favourite = ({ isFavorite, onSelect, style }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Selector onPress={onSelect} style={style}>
      <Text> {isFavorite ? <Icons.Favourite /> : <Icons.NotFavourite />} </Text>
    </Selector>
  );
};

export default Favourite;
