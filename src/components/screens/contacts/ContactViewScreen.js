import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import Screen from "../../layout/Screen";
import ContactView from "../../entity/contacts/ContactView";

const ContactViewScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { contact, onDelete, onModify } = route.params;
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const goToModifyScreen = () =>
    navigation.navigate("ContactModifyScreen", { contact, onModify });
  // View --------------------------------------------
  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Contact Details</Text>
            <Text style={styles.subtitle}>
              View information for {contact.ContactLabel}
            </Text>
          </View>

          <View style={styles.cardContainer}>
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
  cardContainer: {
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

export default ContactViewScreen;
