const intialUsers = [
    {
      UserID: "1",
      UserFirstname: "Alice",
      UserLastname: "Johnson",
      UserPhone: "123-456-7890",
      UserUsername: "alicej",
      UserPassword: "encryptedpassword1", // This should be an encrypted password
      UserLatitude: 40.7128,
      UserLongitude: -74.0060,
      UserTimestamp: Date.now(),
    },
    {
      UserID: "2",
      UserFirstname: "Bob",
      UserLastname: "Smith",
      UserPhone: "234-567-8901",
      UserUsername: "bobsmith",
      UserPassword: "encryptedpassword2", // This should be an encrypted password
      UserLatitude: 34.0522,
      UserLongitude: -118.2437,
      UserTimestamp: Date.now(),
    },
    {
      UserID: "3",
      UserFirstname: "Carol",
      UserLastname: "Davis",
      UserPhone: "345-678-9012",
      UserUsername: "carold",
      UserPassword: "encryptedpassword3", // This should be an encrypted password
      UserLatitude: 41.8781,
      UserLongitude: -87.6298,
      UserTimestamp: Date.now(),
    },
  ];
  
  export default intialUsers;