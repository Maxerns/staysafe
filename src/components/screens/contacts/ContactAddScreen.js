import { StyleSheet } from "react-native";
import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";

const ContactAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  // State -------------------------------------------

  // Handlers ----------------------------------------
  const handleCancel = navigation.goBack;

  // View --------------------------------------------
  return (
    <Screen>
      <ContactForm onSave={onAdd} onCancel={handleCancel} />
    </Screen>
  );
};

const styles = StyleSheet.create({});

export default ContactAddScreen;
