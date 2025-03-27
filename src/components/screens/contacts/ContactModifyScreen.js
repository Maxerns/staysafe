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
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Edit Contact
            </Text>
            <Text style={[styles.subtitle, { color: theme.inactive }]}>
              Update information for {contact.ContactLabel}
            </Text>
          </View>

            <ContactForm
              initialContact={contact}
              initialContactUsername={contact.userDetails ? contact.userDetails.UserUsername : ""}
              onSave={handleSave}
              onCancel={handleCancel}
            />
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  formWrapper: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ContactModifyScreen;
