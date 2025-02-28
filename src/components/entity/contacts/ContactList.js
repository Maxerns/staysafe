import { StyleSheet, ScrollView} from "react-native";
import ContactItem from "./ContactItem";

const ContactList = ({contacts, onSelect}) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <ScrollView style={styles.container}>
      {contacts.map((contact) => {
        return <ContactItem key={contact.ContactID} contact={contact} onSelect={onSelect} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default ContactList;