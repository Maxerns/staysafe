import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import ActivityAddScreen from "../screens/activities/ActivityAddScreen";
import ActivityViewScreen from "../screens/activities/ActivityViewScreen";
import ActivityModifyScreen from "../screens/activities/ActivityModifyScreen";
import ActivityMapScreen from "../screens/activities/ActivityMapScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import { AuthContext } from "../context/authContext";
import ContactAddScreen from "../screens/contacts/ContactAddScreen";
import ContactViewScreen from "../screens/contacts/ContactViewScreen";
import ContactModifyScreen from "../screens/contacts/ContactModifyScreen";

const Stack = createNativeStackNavigator();

// Shared screen options for consistent styling
const screenOptions = {
  headerStyle: {
    backgroundColor: "#122f76",
  },
  headerTitleStyle: {
    fontWeight: "600",
    fontSize: 18,
  },
  headerTintColor: "white",
  headerShadowVisible: true,
  animation: "slide_from_right",
  contentStyle: {
    backgroundColor: "#f8f9fa",
  },
  // Back button settings
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    paddingLeft: 5,
  },
};

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="SignInScreen"
    screenOptions={{
      ...screenOptions,
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="SignInScreen"
      component={SignInScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUpScreen"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator initialRouteName="Drawer" screenOptions={screenOptions}>
    <Stack.Screen
      name="Drawer"
      component={DrawerNavigator}
      options={{ headerShown: false }}
    />

    {/* Activity Screens */}
    <Stack.Screen
      name="ActivityAddScreen"
      component={ActivityAddScreen}
      options={{
        title: "Add Activity",
        animation: "slide_from_bottom",
      }}
    />
    <Stack.Screen
      name="ActivityViewScreen"
      component={ActivityViewScreen}
      options={{
        title: "Activity Details",
      }}
    />
    <Stack.Screen
      name="ActivityModifyScreen"
      component={ActivityModifyScreen}
      options={{
        title: "Edit Activity",
      }}
    />
    <Stack.Screen
      name="ActivityMapScreen"
      component={ActivityMapScreen}
      options={{
        title: "Select Locations",
        animation: "fade_from_bottom",
      }}
    />

    {/* Contact Screens */}
    <Stack.Screen
      name="ContactAddScreen"
      component={ContactAddScreen}
      options={{
        title: "Add Contact",
        animation: "slide_from_bottom",
      }}
    />
    <Stack.Screen
      name="ContactViewScreen"
      component={ContactViewScreen}
      options={{
        title: "Contact Details",
      }}
    />
    <Stack.Screen
      name="ContactModifyScreen"
      component={ContactModifyScreen}
      options={{
        title: "Edit Contact",
      }}
    />
  </Stack.Navigator>
);

const StackNavigator = () => {
  const { isSignedIn, isLoading } = useContext(AuthContext);

  // Show a loading screen if checking authentication state
  if (isLoading) {
    return null; // Or a loading spinner component
  }

  return isSignedIn() ? <AppStack /> : <AuthStack />;
};

export default StackNavigator;
