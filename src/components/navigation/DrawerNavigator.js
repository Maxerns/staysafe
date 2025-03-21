import React, { useContext } from "react";
import { View, StyleSheet, Text, Image, Switch } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import ActivityListScreen from "../screens/activities/ActivityListScreen";
import ContactListScreen from "../screens/contacts/ContactListScreen";
import { Button } from "../UI/Button";
import { AuthContext } from "../context/authContext";
import { ThemeContext, useTheme } from "../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

// Custom drawer content component with sign out button
const CustomDrawerContent = (props) => {
  // Initialisations ---------------------------------
  const { signOut, user } = useContext(AuthContext);
  const { theme, isDarkMode, toggleTheme } = useTheme();
  // State -------------------------------------------
  // Handlers ----------------------------------------
  const handleSignOut = () => {
    signOut();
  };

  // View --------------------------------------------
  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: theme.drawerBackground },
      ]}
    >
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.drawerHeader,
            { backgroundColor: theme.drawerHeaderBackground },
          ]}
        >
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

        <View
          style={[styles.drawerItemsContainer, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.inactive }]}>
            NAVIGATION
          </Text>
          <DrawerItemList
            {...props}
            labelStyle={[styles.drawerItemLabel, { color: theme.text }]}
            itemStyle={styles.drawerItem}
          />

          <View
            style={[
              styles.themeToggleContainer,
              { borderTopColor: theme.border },
            ]}
          >
            <Text style={[styles.themeToggleText, { color: theme.text }]}>
              Dark Mode
            </Text>
            <View style={styles.themeIcons}>
              <Ionicons
                name="sunny"
                size={20}
                color={isDarkMode ? theme.inactive : theme.warning}
              />
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                style={styles.themeSwitch}
              />
              <Ionicons
                name="moon"
                size={20}
                color={isDarkMode ? theme.info : theme.inactive}
              />
            </View>
          </View>
        </View>
      </DrawerContentScrollView>

      <View style={[styles.signOutContainer, { borderTopColor: theme.border }]}>
        <Button
          label="Sign Out"
          onClick={handleSignOut}
          styleButton={styles.signOutButton}
          styleLabel={styles.signOutButtonText}
        />
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.inactive,
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
        drawerStyle: {
          backgroundColor: theme.drawerBackground,
        },
        sceneContainerStyle: {
          backgroundColor: theme.background,
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
  },
  scrollContent: {
    paddingVertical: 0,
  },
  drawerHeader: {
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
  themeToggleContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 15,
    marginHorizontal: 16,
    borderTopWidth: 1,
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  themeIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "60%",
  },
  themeSwitch: {
    marginHorizontal: 10,
  },
  signOutContainer: {
    padding: 16,
    borderTopWidth: 1,
    marginTop: 10,
    marginBottom: 20,
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
