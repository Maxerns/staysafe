import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivityListScreen from "../screens/activities/ActivityListScreen";
import ActivityAddScreen from "../screens/activities/ActivityAddScreen";
import ActivityViewScreen from "../screens/activities/ActivityViewScreen";
import ActivityModifyScreen from "../screens/activities/ActivityModifyScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
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
  </Stack.Navigator>
);

export default StackNavigator;
