import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Screen from "../../layout/Screen";
import ContactForm from "../../entity/contacts/ContactForm";
import { useTheme } from "../../context/themeContext";

const ContactAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  const { theme } = useTheme();
  // State -------------------------------------------

  // Handlers ----------------------------------------
  const handleCancel = navigation.goBack;

  // View --------------------------------------------
  return (
    <Screen style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Add Contact
            </Text>
            <Text style={[styles.subtitle, { color: theme.inactive }]}>
              Create a new StaySafe contact
            </Text>
          </View>

          <View style={[styles.formWrapper, { backgroundColor: theme.card }]}>
            <ContactForm onSave={onAdd} onCancel={handleCancel} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
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

export default ContactAddScreen;
