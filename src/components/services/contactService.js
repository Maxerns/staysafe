import axios from "axios";

const API_URL = "https://softwarehub.uk/unibase/staysafe/v1/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const contactService = {
  // Get user's contacts
  getUserContacts: async (userId) => {
    try {
      // Try to fetch all contacts
      const response = await apiClient.get("/contacts");

      // Handle response depending on what's returned
      if (Array.isArray(response.data)) {
        // Filter contacts where ContactUserID matches the current user's ID
        return response.data.filter(
          (contact) =>
            contact.ContactUserID === userId ||
            contact.ContactUserID === String(userId)
        );
      } else if (
        response.data &&
        response.data.message === "No record(s) found"
      ) {
        return [];
      } else if (Array.isArray(response.data.records)) {
        // Some APIs nest results in a 'records' property
        return response.data.records.filter(
          (contact) =>
            contact.ContactUserID === userId ||
            contact.ContactUserID === String(userId)
        );
      }

      return [];
    } catch (error) {
      console.error(`Error fetching contacts for user ${userId}:`, error);
      return []; // Return empty array on error
    }
  },

  // Create new contact
  createContact: async (contactData) => {
    try {
      const response = await apiClient.post("/contacts", contactData);
      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  },

  // Update contact
  updateContact: async (contactId, contactData) => {
    try {
      const response = await apiClient.put(
        `/contacts/${contactId}`,
        contactData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${contactId}:`, error);
      throw error;
    }
  },

  // Delete contact
  deleteContact: async (contactId) => {
    try {
      const response = await apiClient.delete(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${contactId}:`, error);
      throw error;
    }
  },

  // Find user by username
  findUserByUsername: async (username) => {
    try {
      // Get all users
      const response = await apiClient.get("/users");
      const users = response.data;

      // Find user with matching username (case-insensitive)
      const user = users.find(
        (u) => u.UserUsername.toLowerCase() === username.toLowerCase()
      );

      return user || null;
    } catch (error) {
      console.error(`Error finding user by username:`, error);
      return null;
    }
  },

  // Get all users for contact selection
  getAllUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      // If response data is an array, use the first element
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      return userData;
    } catch (error) {
      console.error(`Error fetching user by ID ${userId}:`, error);
      return null;
    }
  },
};

export default contactService;
