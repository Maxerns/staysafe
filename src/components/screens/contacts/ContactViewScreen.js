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
    <Screen style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Contact Details
            </Text>
            <Text style={[styles.subtitle, { color: theme.inactive }]}>
              View information for {contact.ContactLabel}
            </Text>
          </View>

          <View style={[styles.cardContainer, { backgroundColor: theme.card }]}>
            <ContactView
              contact={contact}
              onDelete={onDelete}
              onModify={goToModifyScreen}
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
  cardContainer: {
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ContactViewScreen;
