import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Screen from "../../layout/Screen.js";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import intialUsers from "../../../data/users.js";

const defaultContact = {
  ContactID: null,
  ContactUserID: "",
  ContactContactID: "",
  ContactLabel: "",
  ContactDatecreated: new Date().toISOString(),
};

const ContactAddScreen = ({ navigation, route }) => {
  // Initialisations ---------------------------------
  const { onAdd } = route.params;
  defaultContact.ContactID = Math.floor(100000 + Math.random() * 900000).toString();

  // State -------------------------------------------
  const [contact, setContact] = useState(defaultContact);
  const [contactUsername, setContactUsername] = useState(""); // input for the contact's username
  const [error, setError] = useState(null);

  // Handlers ----------------------------------------
  const handleAdd = () => {
    // Basic validation: ensure both username and label are provided
    if (!contactUsername.trim() || !contact.ContactLabel.trim()) {
      setError("All fields are required.");
      return;
    }

    // Assume logged in user id is "1"
    const currentUserID = "1";

    // Look up the contact by username (case-insensitive)
    const foundUser = intialUsers.find(
      (user) => user.UserUsername.toLowerCase() === contactUsername.trim().toLowerCase()
    );

    //later: check if the user is already a contact
    //later: check if the user is the logged in user and prevent adding self as contact

    if (!foundUser) {
      setError("User not found.");
      return;
    }

    // Construct the new contact object
    const newContact = {
      ...contact,
      ContactUserID: currentUserID,
      ContactContactID: foundUser.UserID,
      ContactDatecreated: new Date().toISOString(),
    };

    onAdd(newContact);
  };

  const handleCancel = navigation.goBack;

  const handleChange = (field, value) => {
    setContact({ ...contact, [field]: value });
    if (error) {
      setError(null);
    }
  };

  // View --------------------------------------------
  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.item}>
            <Text style={styles.itemLabel}>Contact Username</Text>
            <TextInput
              value={contactUsername}
              onChangeText={(value) => {
                setContactUsername(value);
                if (error) setError(null);
              }}
              style={styles.itemInput}
            />
          </View>

          <View style={styles.item}>
            <Text style={styles.itemLabel}>Contact Label</Text>
            <TextInput
              value={contact.ContactLabel}
              onChangeText={(value) => handleChange("ContactLabel", value)}
              style={styles.itemInput}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <ButtonTray>
            <Button label="Save" icon={<Icons.Add />} onClick={handleAdd} />
            <Button label="Cancel" onClick={handleCancel} />
          </ButtonTray>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  item: {
    marginVertical: 8,
  },
  itemLabel: {
    color: "grey",
    fontSize: 16,
    marginBottom: 5,
  },
  itemInput: {
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default ContactAddScreen;