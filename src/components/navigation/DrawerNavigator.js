import React, { useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
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
  const { signOut, user } = useContext(AuthContext);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Drawer Header with Logo and User Info */}
        <View style={styles.drawerHeader}>
          <Image
            source={require("../../../assets/StaySafeVector.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.userInfoContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.info?.firstname}</Text>
          </View>
        </View>

        {/* Drawer Items Section */}
        <View style={styles.drawerItemsContainer}>
          <Text style={styles.sectionTitle}>NAVIGATION</Text>
          <DrawerItemList
            {...props}
            labelStyle={styles.drawerItemLabel}
            itemStyle={styles.drawerItem}
          />
        </View>
      </DrawerContentScrollView>

      {/* Sign Out Section */}
      <View style={styles.signOutContainer}>
        <Button
          label="Sign Out"
          onClick={handleSignOut}
          style={styles.signOutButton}
          textStyle={styles.signOutButtonText}
        />
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#122f76",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#122f76",
        drawerInactiveTintColor: "#555",
        drawerLabelStyle: {
          marginLeft: 0,
          fontWeight: "500",
          fontSize: 16,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 10,
          marginVertical: 4,
        },
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
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingVertical: 0,
  },
  drawerHeader: {
    backgroundColor: "#122f76",
    padding: 20,
    paddingBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 75,
    tintColor: "white",
  },
  userInfoContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  welcomeText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  drawerItemsContainer: {
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12,
    color: "gray",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 5,
    letterSpacing: 1,
  },
  drawerItem: {
    backgroundColor: "transparent",
  },
  drawerItemLabel: {
    fontWeight: "500",
  },
  signOutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 30,
    marginBottom: 30,
  },
  signOutButton: {
    backgroundColor: "#ff3b3b",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default DrawerNavigator;
