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
    <View style={[styles.drawerContainer, { backgroundColor: theme.drawerBackground }]}>
      <View>
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
          style={[styles.drawerItemsContainer, { backgroundColor: theme.background }]}
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
      </View>

      <View style={[styles.signOutContainer, { borderTopColor: theme.border }]}>
        <Button
          label="Sign Out"
          icon={<Ionicons name="log-out-outline" size={16} color="white" />}
          onClick={handleSignOut}
          styleButton={{ backgroundColor: theme.accent }}
          styleLabel={{ color: theme.buttonText }}
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
        headerRight: () => <Image source={require("../../../assets/StaySafeVector.png")} style={styles.miniLogo} />,
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
    justifyContent: "space-between", // forces sign out at bottom
  },

  drawerHeader: {
    padding: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 75,
    tintColor: "white",
  },
  miniLogo: {
    width: 35,
    height: 35,
    tintColor: "white",
    marginRight: 10,
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
    marginBottom: 48,
  },
});

export default DrawerNavigator;
