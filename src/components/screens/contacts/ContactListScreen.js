import { useState } from "react"; 
import { Text, StyleSheet } from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import ContactList from "../../entity/contacts/ContactList.js";
import intialContacts from "../../../data/contacts.js";
import Screen from "../../layout/Screen.js";

const ContactListScreen =  ({ navigation }) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [contacts, setContacts] = useState(intialContacts);
  // Handlers ----------------------------------------
  const handleDelete = (contact) => {
    setContacts(contacts.filter((c) => c.ContactID !== contact.ContactID));
  };

  const handleAdd = (contact) => setContacts([...contacts, contact]);

  const onDelete = (contact) => {
    handleDelete(contact);
    navigation.goBack();
  };

  const onModify = (contact) => {
    setContacts(
      contacts.map((c) =>
        c.ContactID === contact.ContactID ? contact : c
      )
    );
    navigation.goBack();
  };

  const onAdd = (contact) => {
    handleAdd(contact);
    navigation.goBack();
  };
  
  const goToViewScreen = (contact) => navigation.navigate('ContactViewScreen', { contact, onDelete, onModify });
  const goToAddScreen = () => navigation.navigate('ContactAddScreen', { onAdd });
  // View --------------------------------------------
  return (
    <Screen>
      <ButtonTray>
      <Text style={styles.welcome}>Contacts</Text>
      <Button label="Add" icon={<Icons.Add />} onClick={goToAddScreen} />
      </ButtonTray>
      <ContactList contacts={contacts} onSelect={goToViewScreen} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  welcome: {
    marginTop: 16,
    marginBottom: 5,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ContactListScreen;
