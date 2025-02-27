import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import ActivityAddScreen from "../screens/activities/ActivityAddScreen";
import ActivityViewScreen from "../screens/activities/ActivityViewScreen";
import ActivityModifyScreen from "../screens/activities/ActivityModifyScreen";
import ContactAddScreen from "../screens/contacts/ContactAddScreen";
import ContactViewScreen from "../screens/contacts/ContactViewScreen";
import ContactModifyScreen from "../screens/contacts/ContactModifyScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Drawer"
    screenOptions={{
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
    }}
  >
    <Stack.Screen
      name="Drawer"
      component={DrawerNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ActivityAddScreen"
      component={ActivityAddScreen}
      options={{ title: "Add Activity" }}
    />
    <Stack.Screen
      name="ActivityViewScreen"
      component={ActivityViewScreen}
      options={{ title: "View Activity" }}
    />
    <Stack.Screen
      name="ActivityModifyScreen"
      component={ActivityModifyScreen}
      options={{ title: "Modify Activity" }}
    />

    <Stack.Screen
      name="ContactAddScreen"
      component={ContactAddScreen}
      options={{ title: "Add Contact" }}
    />
    <Stack.Screen
      name="ContactViewScreen"
      component={ContactViewScreen}
      options={{ title: "View Contact" }}
    />
    <Stack.Screen
      name="ContactModifyScreen"
      component={ContactModifyScreen}
      options={{ title: "Modify Contact" }}
    />
  </Stack.Navigator>
);

export default StackNavigator;
