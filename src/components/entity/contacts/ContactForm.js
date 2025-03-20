import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Icons from "../../UI/Icons.js";
import Form from "../../UI/Form.js";
import { contactService } from "../../services/contactService.js";

const defaultContact = {
  ContactID: null,
  ContactContactID: null,
  ContactLabel: "",
  ContactDatecreated: new Date().toISOString(),
};

const ContactForm = ({
  initialContact,
  initialContactUsername,
  onSave,
  onCancel,
}) => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  const [contact, setContact] = useState(initialContact || defaultContact);
  const [username, setUsername] = useState(initialContactUsername || "");
  const [isValidating, setIsValidating] = useState(false);
  const [usernameError, setUsernameError] = useState(null);
  const [isUserFound, setIsUserFound] = useState(false);

  // Handlers ----------------------------------------
  const handleSubmit = async () => {
    // Validate form fields
    if (!contact.ContactLabel.trim()) {
      setUsernameError("Contact label is required");
      return;
    }

    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }

    try {
      setIsValidating(true);
      setUsernameError(null);

      // Automatically validate username
      const foundUser = await contactService.findUserByUsername(username);

      if (foundUser) {
        // Update contact with found user ID
        const updatedContact = {
          ...contact,
          ContactContactID: foundUser.UserID,
        };

        // Submit form with updated contact data
        await onSave(updatedContact);
        onCancel();
      } else {
        setUsernameError(`User '${username}' not found`);
      }
    } catch (error) {
      console.error("Error validating username:", error);
      setUsernameError("Error validating username");
    } finally {
      setIsValidating(false);
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    setUsernameError(null);
    setIsUserFound(false);
  };

  const handleLabelChange = (value) => {
    setContact({
      ...contact,
      ContactLabel: value,
    });
  };

  // Check username when form loads if initialContactUsername is provided
  useEffect(() => {
    if (initialContactUsername) {
      validateUsername();
    }
  }, [initialContactUsername]);

  // Keep for internal use only - won't be exposed in UI
  const validateUsername = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }

    try {
      setIsValidating(true);
      const foundUser = await contactService.findUserByUsername(username);

      if (foundUser) {
        setContact({
          ...contact,
          ContactContactID: foundUser.UserID,
        });
        setIsUserFound(true);
        setUsernameError(null);
      } else {
        setUsernameError(`User '${username}' not found`);
        setIsUserFound(false);
      }
    } catch (error) {
      setUsernameError("Error validating username");
      console.error("Error validating username:", error);
    } finally {
      setIsValidating(false);
    }
  };

  // View --------------------------------------------
  const submitLabel = initialContact ? "Update Contact" : "Add Contact";
  const submitIcon = initialContact ? <Icons.Edit /> : <Icons.Add />;

  return (
    <Form
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={submitLabel}
      submitIcon={submitIcon}
    >
      <Form.InputText
        label="Username"
        value={username}
        onChange={handleUsernameChange}
      />

      {usernameError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{usernameError}</Text>
        </View>
      )}

      {isValidating && (
        <View style={styles.validatingContainer}>
          <ActivityIndicator size="small" color="#000" />
          <Text style={styles.validatingText}>Checking username...</Text>
        </View>
      )}

      {isUserFound && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>User found!</Text>
        </View>
      )}

      <Form.InputText
        label="Contact Label (nickname)"
        value={contact.ContactLabel}
        onChange={handleLabelChange}
      />
    </Form>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    padding: 8,
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  validatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
  },
  validatingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  successContainer: {
    padding: 8,
    marginVertical: 5,
  },
  successText: {
    color: "green",
    fontSize: 14,
  },
});

export default ContactForm;
