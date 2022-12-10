import { ColorsApp } from './constants/Colors'

import HomeNavigation from './navigations/HomeNavigation';
import LoginNavigation from './navigations/LoginNavigation'
import PublicationNavigation from './navigations/PublicationNavigation'
import AdminNavigation from './navigations/AdminNavigation'
import UserPublicationNavigation from './navigations/UserPublicationNavigation'

import NotificationsScreen from './screens/NotificationsScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import store from './redux/store'
import { Provider } from 'react-redux'

const rootNavigationStack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>

      <NavigationContainer>
        <rootNavigationStack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: ColorsApp.primaryColor,
            },
            headerTintColor: ColorsApp.secondaryColor,
          }}
        >
          <rootNavigationStack.Screen
            name="LoginNavigation"
            component={LoginNavigation}
            options={{ headerShown: false }}
          />
          <rootNavigationStack.Screen
            name="HomeNavigation"
            component={HomeNavigation}
            options={{ headerShown: false }}
          />
          <rootNavigationStack.Screen
            name="PublicationNavigation"
            component={PublicationNavigation}
            options={{ headerShown: false }}
          />
          <rootNavigationStack.Screen
            name="AdminNavigation"
            component={AdminNavigation}
            options={{ title: "Perfil de Usuario ", headerShown: false }}
          />
          <rootNavigationStack.Screen
            name="UserPublicationNavigation"
            component={UserPublicationNavigation}
            options={{
              title: "UserPublicationNavigation ",
              headerShown: false,
            }}
          />
          <rootNavigationStack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
            options={{ title: "Notificaciones", headerShown: false }}
          />
        </rootNavigationStack.Navigator>
      </NavigationContainer>

    </Provider>
  );
}
