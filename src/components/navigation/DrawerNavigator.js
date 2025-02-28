import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ActivityListScreen from '../screens/activities/ActivityListScreen';
import ContactListScreen from '../screens/contacts/ContactListScreen';
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'white'
    }}>
      <Drawer.Screen name="Activities" component={ActivityListScreen} options={{ title: 'Activities' }} />
      <Drawer.Screen name="Contacts" component={ContactListScreen} options={{ title: 'Contacts' }} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;