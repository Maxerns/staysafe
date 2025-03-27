import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Screen from "../../layout/Screen";
import ContactView from "../../entity/contacts/ContactView";
import { useTheme } from "../../context/themeContext";

const ContactViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onDelete, onModify } = route.params;
  const { theme } = useTheme();
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

const styles = StyleSheet.create({
});

export default ContactViewScreen;
