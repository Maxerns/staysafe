import { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Button } from "../../UI/Button.js";
import ContactList from "../../entity/contacts/ContactList.js";
import { useContacts } from "../../context/contactContext";
import Screen from "../../layout/Screen.js";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext.js";
import { useTheme } from "../../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

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
  const { theme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------

  const onDelete = async (contactId) => {
    try {
      await deleteContact(contactId);
    } catch (err) {
      console.error("Error deleting contact:", err);
      Alert.alert("Error", `Failed to delete contact: ${err.message}`);
    }
    navigation.goBack();
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
  return (
    <Screen>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading contacts...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            Error: {error}
          </Text>
          <Button
            label="Retry"
            onClick={refreshContacts}
            styleButton={styles.retryButton}
            styleLabel={styles.retryButtonText}
          />
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No contacts found
          </Text>
          <Text style={styles.emptySubtext}>
            Add contacts to keep track of your connections
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={goToAddScreen}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.emptyAddButtonText}>Add First Contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <ContactList contacts={contacts} onSelect={goToViewScreen} />
        </View>
      )}
      {/* FAB Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme?.primary || "#122f76" }]}
        onPress={goToAddScreen}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </Screen>
  );
};

const styles = StyleSheet.create({
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
  contentContainer: {
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 24,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff3b3b",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 30,
  },
  emptyAddButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
  },
  // Removed or ignore old buttonTray, addButton, addButtonText styles
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    right: 20,
    bottom: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  retryButton: {
    backgroundColor: "#ff3b3b",
    borderColor: "#ff3b3b",
    minWidth: 160,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ContactListScreen;
