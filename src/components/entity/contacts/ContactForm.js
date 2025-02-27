import { useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { ButtonTray, Button } from "../../UI/Button.js";
import Icons from "../../UI/Icons.js";
import intialUsers from "../../../data/users.js";

const ContactForm = ({
  initialContact,
  initialContactUsername = "",
  onSave,
  onCancel,
}) => {
  const [contact, setContact] = useState(initialContact);
  const [contactUsername, setContactUsername] = useState(initialContactUsername);
  const [error, setError] = useState(null);

  const handleSave = () => {
    // Ensure both username and label are provided
    if (!contactUsername.trim() || !contact.ContactLabel.trim()) {
      setError("All fields are required.");
      return;
    }

    // Assume the logged in user id is "1"
    const currentUserID = "1";

    // Look up the contact by username (case-insensitive)
    const foundUser = intialUsers.find(
      (user) =>
        user.UserUsername.toLowerCase() === contactUsername.trim().toLowerCase()
    );

    if (!foundUser) {
      setError("User not found.");
      return;
    }

    const newContact = {
      ...contact,
      ContactUserID: currentUserID,
      ContactContactID: foundUser.UserID,
      ContactDatecreated: new Date().toISOString(),
    };

    onSave(newContact);
  };

  const handleChange = (field, value) => {
    setContact({ ...contact, [field]: value });
    if (error) setError(null);
  };

  return (
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
          <Button label="Save" icon={<Icons.Add />} onClick={handleSave} />
          <Button label="Cancel" onClick={onCancel} />
        </ButtonTray>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default ContactForm;