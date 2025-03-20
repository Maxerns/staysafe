import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
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
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Contact</Text>
            <Text style={styles.subtitle}>Create a new StaySafe contact</Text>
          </View>

          <View style={styles.formWrapper}>
            <ContactForm onSave={onAdd} onCancel={handleCancel} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
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

export default ContactAddScreen;
