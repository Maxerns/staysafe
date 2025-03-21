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
import intialUsers from "../../../data/users.js";
import { useTheme } from "../../context/themeContext";

const ContactModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onModify } = route.params;
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const foundUser = intialUsers.find(
    (user) => user.UserID === contact.ContactContactID
  );
  const initialContactUsername = foundUser ? foundUser.UserUsername : "";

  const handleSave = (modifiedContact) => {
    // Keep original ContactUserID in case it wasn't included in the form
    const updatedContact = {
      ...modifiedContact,
      ContactUserID: contact.ContactUserID,
    };

    onModify(updatedContact);
  };

  const handleCancel = navigation.goBack;

  // View --------------------------------------------
  return (
    <Screen style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Edit Contact
            </Text>
            <Text style={[styles.subtitle, { color: theme.inactive }]}>
              Update information for {contact.ContactLabel}
            </Text>
          </View>

          <View style={[styles.formWrapper, { backgroundColor: theme.card }]}>
            <ContactForm
              initialContact={contact}
              initialContactUsername={initialContactUsername}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
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
