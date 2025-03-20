import { useState } from "react";
import { Text, StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import ContactList from "../../entity/contacts/ContactList.js";
import { useContacts } from "../../context/contactContext";
import Screen from "../../layout/Screen.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext.js";

const ContactListScreen = ({ navigation }) => {
  // Initialisations ---------------------------------
  const {
    contacts,
    loading,
    error,
    addContact,
    deleteContact,
    updateContact,
    refreshContacts,
  } = useContacts();
  const { user } = useContext(AuthContext);
  // State -------------------------------------------
  // Handlers ----------------------------------------

  const onDelete = async (contactId) => {
    try {
      await deleteContact(contactId);
      navigation.goBack();
    } catch (err) {
      console.error("Error deleting contact:", err);
      Alert.alert("Error", `Failed to delete contact: ${err.message}`);
    }
  };

  const onAdd = async (contactData) => {
    try {
      if (!contactData.ContactContactID) {
        Alert.alert("Error", "No valid user selected");
        return;
      }

      // Create contact object with current user ID
      const newContact = {
        ...contactData,
        ContactUserID: user.info.id,
      };

      await addContact(newContact);
      navigation.goBack();
    } catch (err) {
      console.error("Error adding contact:", err);
      Alert.alert("Error", `Failed to add contact: ${err.message}`);
    }
  };

  const onModify = async (contactData) => {
    try {
      if (!contactData.ContactContactID) {
        Alert.alert("Error", "No valid user selected");
        return;
      }

      await updateContact(contactData.ContactID, contactData);
      navigation.goBack();
    } catch (err) {
      console.error("Error updating contact:", err);
      Alert.alert("Error", `Failed to update contact: ${err.message}`);
    }
  };

  const goToViewScreen = (contact) =>
    navigation.navigate("ContactViewScreen", {
      contact,
      onDelete: () => onDelete(contact.ContactID),
      onModify,
    });

  const goToAddScreen = () =>
    navigation.navigate("ContactAddScreen", { onAdd });

  // View --------------------------------------------
  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <ButtonTray>
        <Text style={styles.welcome}>Contacts</Text>
        <Button label="Add" icon={<Icons.Add />} onClick={goToAddScreen} />
      </ButtonTray>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button label="Retry" onClick={refreshContacts} />
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contacts found</Text>
          <Button
            label="Add Contact"
            icon={<Icons.Add />}
            onClick={goToAddScreen}
          />
        </View>
      ) : (
        <ContactList contacts={contacts} onSelect={goToViewScreen} />
      )}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ContactListScreen;
