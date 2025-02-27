import { Text } from "react-native";
import Screen from "../../layout/Screen";
import ContactView from "../../entity/contacts/ContactView";


const ActivityViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onDelete } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <Screen>
        <ContactView contact={contact} onDelete={onDelete} />
    </Screen>
  );
}

export default ActivityViewScreen;
