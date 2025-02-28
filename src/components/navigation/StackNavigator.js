import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import ActivityAddScreen from "../screens/activities/ActivityAddScreen";
import ActivityViewScreen from "../screens/activities/ActivityViewScreen";
import ActivityModifyScreen from "../screens/activities/ActivityModifyScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import { AuthContext } from "../context/authContext";
import ContactAddScreen from "../screens/contacts/ContactAddScreen";
import ContactViewScreen from "../screens/contacts/ContactViewScreen";
import ContactModifyScreen from "../screens/contacts/ContactModifyScreen";

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="SignInScreen"
    screenOptions={{
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
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
      name="ActivityListScreen"
      component={ActivityListScreen}
      options={{ title: "Activities", headerShown: false }}
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

const StackNavigator = () => {
  const { isSignedIn, isLoading } = useContext(AuthContext);

  // Show a loading screen if checking authentication state
  if (isLoading) {
    return null; // Or a loading spinner component
  }

  return isSignedIn() ? <AppStack /> : <AuthStack />;
};

export default StackNavigator;
