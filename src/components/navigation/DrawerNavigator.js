import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import ActivityListScreen from "../screens/activities/ActivityListScreen";
import ContactListScreen from "../screens/contacts/ContactListScreen";
import { Button } from "../UI/Button";
import { AuthContext } from "../context/authContext";

const Drawer = createDrawerNavigator();

// Custom drawer content component with sign out button
const CustomDrawerContent = (props) => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.signOutContainer}>
        <Button
          label="Sign Out"
          onClick={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    >
      <Drawer.Screen
        name="Activities"
        component={ActivityListScreen}
        options={{ title: "Activities" }}
      />
      <Drawer.Screen
        name="Contacts"
        component={ContactListScreen}
        options={{ title: "Contacts" }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  signOutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 15,
  },
  signOutButton: {
    backgroundColor: "#e74c3c", // Red color for sign out
  },
});

export default DrawerNavigator;
