import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";
import { useTheme } from "../../context/themeContext";

const ContactModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onModify } = route.params;
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------

  const handleSave = async (modifiedContact) => {
    // Keep original ContactUserID in case it wasn't included in the form
    const updatedContact = {
      ...modifiedContact,
      ContactUserID: contact.ContactUserID,
    };

    await onModify(updatedContact);
    navigation.goBack();
  };

  const handleCancel = navigation.goBack;

  // View --------------------------------------------
  return (
    <Screen>
      <ContactForm
        initialContact={contact}
        initialContactUsername={
          contact.userDetails ? contact.userDetails.UserUsername : ""
        }
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
});

export default ContactModifyScreen;
