const intialContacts = [
    {
      ContactID: "1",
      ContactName: "Evening Walk",
      ContactDescription: "Walking through the park",
      ContactFrom: {
        LocationName: "Home",
        LocationAddress: "123 Main St",
        LocationPostcode: "12345",
        LocationCoordinate: { lat: 40.7128, lng: -74.006 },
      },
      ContactLeave: new Date().toISOString(),
      ContactTo: {
        LocationName: "City Park",
        LocationAddress: "456 Park Ave",
        LocationPostcode: "67890",
        LocationCoordinate: { lat: 40.7306, lng: -73.9352 },
      },
    },
    {
      ContactID: "2",
      ContactName: "Morning Jog",
      ContactDescription: "Jogging around the neighborhood",
      ContactFrom: {
        LocationName: "Home",
        LocationAddress: "123 Main St",
        LocationPostcode: "12345",
        LocationCoordinate: { lat: 40.7128, lng: -74.006 },
      },
      ContactLeave: new Date().toISOString(),
      ContactTo: {
        LocationName: "Local Track",
        LocationAddress: "789 Fitness Rd",
        LocationPostcode: "23456",
        LocationCoordinate: { lat: 40.715, lng: -74.015 },
      },
    },
    {
      ContactID: "3",
      ContactName: "Lunch with Friends",
      ContactDescription: "Enjoying a meal at a new restaurant",
      ContactFrom: {
        LocationName: "Office",
        LocationAddress: "101 Corporate Blvd",
        LocationPostcode: "34567",
        LocationCoordinate: { lat: 40.72, lng: -74.0 },
      },
      ContactLeave: new Date().toISOString(),
      ContactTo: {
        LocationName: "Downtown Diner",
        LocationAddress: "202 Dining St",
        LocationPostcode: "45678",
        LocationCoordinate: { lat: 40.725, lng: -74.01 },
      },
    },
    {
      ContactID: "4",
      ContactName: "Evening Yoga",
      ContactDescription: "Relaxing yoga session at the studio",
      ContactFrom: {
        LocationName: "Home",
        LocationAddress: "123 Main St",
        LocationPostcode: "12345",
        LocationCoordinate: { lat: 40.7128, lng: -74.006 },
      },
      ContactLeave: new Date().toISOString(),
      ContactTo: {
        LocationName: "Yoga Studio",
        LocationAddress: "303 Wellness Ave",
        LocationPostcode: "56789",
        LocationCoordinate: { lat: 40.73, lng: -74.005 },
      },
    },
    {
      ContactID: "5",
      ContactName: "Night Out",
      ContactDescription: "Visiting a new bar downtown",
      ContactFrom: {
        LocationName: "Home",
        LocationAddress: "123 Main St",
        LocationPostcode: "12345",
        LocationCoordinate: { lat: 40.7128, lng: -74.006 },
      },
      ContactLeave: new Date().toISOString(),
      ContactTo: {
        LocationName: "Downtown Bar",
        LocationAddress: "404 Nightlife Ln",
        LocationPostcode: "67890",
        LocationCoordinate: { lat: 40.74, lng: -74.002 },
      },
    },
  ];
  
  export default intialContacts
  