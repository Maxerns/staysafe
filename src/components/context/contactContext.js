import React, { createContext, useState, useContext, useEffect } from "react";
import { contactService } from "../services/contactService";
import { AuthContext } from "./authContext";

export const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const { user, isSignedIn } = useContext(AuthContext);

  // Load all users (for contact selection)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await contactService.getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    if (isSignedIn()) {
      loadUsers();
    }
  }, [isSignedIn]);

  // Fetch contacts on component mount or when user changes
  useEffect(() => {
    const fetchContacts = async () => {
      if (!isSignedIn()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get user ID consistently
        const userId = user?.info?.id;
        console.log("Fetching contacts for user ID:", userId);

        if (!userId) {
          console.warn("User ID is undefined or null");
          setContacts([]);
          return;
        }

        // Fetch contacts for the current user
        const userContacts = await contactService.getUserContacts(userId);
        setContacts(userContacts || []);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(err.message || "Failed to fetch contacts");
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?.info?.id, isSignedIn]);

  // Find user by username
  const findUserByUsername = async (username) => {
    return await contactService.findUserByUsername(username);
  };


  const addContact = async (contactData) => {
    try {
      setLoading(true);

      // Ensure we have the necessary data
      if (!contactData.ContactContactID) {
        throw new Error("ContactContactID is required");
      }

      if (!contactData.ContactLabel) {
        throw new Error("Contact label is required");
      }

      // Create contact data with user ID
      const newContactData = {
        ContactLabel: contactData.ContactLabel,
        ContactUserID: user.info.id,
        ContactContactID: contactData.ContactContactID,
        ContactDatecreated: new Date().toISOString(),
      };

      // Create contact
      await contactService.createContact(newContactData);

      // Refresh contacts list
      await refreshContacts();

      return true;
    } catch (err) {
      setError(err.message || "Failed to add contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (contactId, contactData) => {
    try {
      setLoading(true);

      // Ensure we have the necessary data
      if (!contactData.ContactContactID) {
        throw new Error("ContactContactID is required");
      }

      if (!contactData.ContactLabel) {
        throw new Error("Contact label is required");
      }

      // Update contact
      const updatedContactData = {
        ContactID: contactId,
        ContactLabel: contactData.ContactLabel,
        ContactUserID: contactData.ContactUserID || user.info.id,
        ContactContactID: contactData.ContactContactID,
      };

      await contactService.updateContact(contactId, updatedContactData);

      // Refresh contacts list
      await refreshContacts();

      return true;
    } catch (err) {
      setError(err.message || "Failed to update contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a contact
  const deleteContact = async (contactId) => {
    try {
      setLoading(true);
      await contactService.deleteContact(contactId);

      // Refresh contacts list
      await refreshContacts();

      return true;
    } catch (err) {
      setError(err.message || "Failed to delete contact");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh contacts
  const refreshContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = user?.info?.id;
      if (!userId) return;

      const userContacts = await contactService.getUserContacts(userId);
      setContacts(userContacts || []);
    } catch (err) {
      setError(err.message || "Failed to refresh contacts");
      console.error("Error refreshing contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        loading,
        error,
        users,
        addContact,
        updateContact,
        deleteContact,
        findUserByUsername,
        refreshContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

// Custom hook to use the contact context
export const useContacts = () => useContext(ContactContext);
