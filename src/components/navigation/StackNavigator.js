import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivityListScreen from "../screens/activities/ActivityListScreen";
import ActivityAddScreen from "../screens/activities/ActivityAddScreen";
import ActivityViewScreen from "../screens/activities/ActivityViewScreen";
import ActivityModifyScreen from "../screens/activities/ActivityModifyScreen";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import { AuthContext } from "../context/authContext";

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
    initialRouteName="ActivityListScreen"
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
