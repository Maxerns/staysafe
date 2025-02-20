import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TripListScreen from "../screens/trips/TripListScreen";
import TripAddScreen from "../screens/trips/TripAddScreen";
import TripViewScreen from "../screens/trips/TripViewScreen";
import TripModifyScreen from "../screens/trips/TripModifyScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="TripListScreen"
    screenOptions={{
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
    }}
  >
    <Stack.Screen
      name="TripListScreen"
      component={TripListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="TripAddScreen"
      component={TripAddScreen}
      options={{ title: "Add Trip" }}
    />
    <Stack.Screen
      name="TripViewScreen"
      component={TripViewScreen}
      options={{ title: "View Trip" }}
    />
    <Stack.Screen
      name="TripModifyScreen"
      component={TripModifyScreen}
      options={{ title: "Modify Trip" }}
    />
  </Stack.Navigator>
);

export default StackNavigator;
