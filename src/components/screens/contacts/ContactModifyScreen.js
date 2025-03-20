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

const ContactModifyScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onModify } = route.params;
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
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Contact</Text>
            <Text style={styles.subtitle}>
              Update information for {contact.ContactLabel}
            </Text>
          </View>

          <View style={styles.formWrapper}>
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
  screen: {
    backgroundColor: "#f8f9fa",
  },
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
    color: "#122f76",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  formWrapper: {
    backgroundColor: "white",
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
