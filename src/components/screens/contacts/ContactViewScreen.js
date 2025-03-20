import { Text } from "react-native";
import Screen from "../../layout/Screen";
import ContactView from "../../entity/contacts/ContactView";

const ActivityViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onDelete, onModify } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const goToModifyScreen = () =>
    navigation.navigate("ContactModifyScreen", { contact, onModify });
  // View --------------------------------------------
  return (
    <Screen>
      <ContactView
        contact={contact}
        onDelete={onDelete}
        onModify={goToModifyScreen}
      />
    </Screen>
  );
};

export default ActivityViewScreen;
