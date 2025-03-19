import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/components/navigation/StackNavigator';
import { AuthProvider } from './src/components/context/authContext';
import { ActivityProvider } from './src/components/context/activityContext';
import { ContactProvider } from './src/components/context/contactContext';

const App = () => {
  // Initialisations ---------------------------------
  // State -------------------------------------------
  // Handlers ----------------------------------------
  // View --------------------------------------------
  return (
    <AuthProvider>
      <ContactProvider>
        <ActivityProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </ActivityProvider>
      </ContactProvider>
    </AuthProvider>
  );
}

export default App;