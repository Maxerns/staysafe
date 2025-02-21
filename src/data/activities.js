const activities = [
  {
    ActivityID: "1",
    ActivityName: "Evening Walk",
    ActivityDescription: "Walking through the park",
    ActivityFrom: {
      LocationName: "Home",
      LocationAddress: "123 Main St",
      LocationPostcode: "12345",
      LocationCoordinate: { lat: 40.7128, lng: -74.006 },
    },
    ActivityLeave: new Date().toISOString(),
    ActivityTo: {
      LocationName: "City Park",
      LocationAddress: "456 Park Ave",
      LocationPostcode: "67890",
      LocationCoordinate: { lat: 40.7306, lng: -73.9352 },
    },
  },
  {
    ActivityID: "2",
    ActivityName: "Morning Jog",
    ActivityDescription: "Jogging around the neighborhood",
    ActivityFrom: {
      LocationName: "Home",
      LocationAddress: "123 Main St",
      LocationPostcode: "12345",
      LocationCoordinate: { lat: 40.7128, lng: -74.006 },
    },
    ActivityLeave: new Date().toISOString(),
    ActivityTo: {
      LocationName: "Local Track",
      LocationAddress: "789 Fitness Rd",
      LocationPostcode: "23456",
      LocationCoordinate: { lat: 40.715, lng: -74.015 },
    },
  },
  {
    ActivityID: "3",
    ActivityName: "Lunch with Friends",
    ActivityDescription: "Enjoying a meal at a new restaurant",
    ActivityFrom: {
      LocationName: "Office",
      LocationAddress: "101 Corporate Blvd",
      LocationPostcode: "34567",
      LocationCoordinate: { lat: 40.72, lng: -74.0 },
    },
    ActivityLeave: new Date().toISOString(),
    ActivityTo: {
      LocationName: "Downtown Diner",
      LocationAddress: "202 Dining St",
      LocationPostcode: "45678",
      LocationCoordinate: { lat: 40.725, lng: -74.01 },
    },
  },
  {
    ActivityID: "4",
    ActivityName: "Evening Yoga",
    ActivityDescription: "Relaxing yoga session at the studio",
    ActivityFrom: {
      LocationName: "Home",
      LocationAddress: "123 Main St",
      LocationPostcode: "12345",
      LocationCoordinate: { lat: 40.7128, lng: -74.006 },
    },
    ActivityLeave: new Date().toISOString(),
    ActivityTo: {
      LocationName: "Yoga Studio",
      LocationAddress: "303 Wellness Ave",
      LocationPostcode: "56789",
      LocationCoordinate: { lat: 40.73, lng: -74.005 },
    },
  },
  {
    ActivityID: "5",
    ActivityName: "Night Out",
    ActivityDescription: "Visiting a new bar downtown",
    ActivityFrom: {
      LocationName: "Home",
      LocationAddress: "123 Main St",
      LocationPostcode: "12345",
      LocationCoordinate: { lat: 40.7128, lng: -74.006 },
    },
    ActivityLeave: new Date().toISOString(),
    ActivityTo: {
      LocationName: "Downtown Bar",
      LocationAddress: "404 Nightlife Ln",
      LocationPostcode: "67890",
      LocationCoordinate: { lat: 40.74, lng: -74.002 },
    },
  },
];

export default activities;
