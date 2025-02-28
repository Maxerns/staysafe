const intialContacts = [
  {
    ContactID: "1", // Unique identifier for the contact
    ContactUserID: "1", // Unique identifier for the user who owns the contact
    ContactContactID: "2", // Id of the user who is the contact
    ContactLabel: "user 2",
    ContactDatecreated: new Date().toISOString(),
  },
  {
    ContactID: "2",
    ContactUserID: "1",
    ContactContactID: "3",
    ContactLabel: "user 3",
    ContactDatecreated: new Date().toISOString(),
  }
];

export default intialContacts;