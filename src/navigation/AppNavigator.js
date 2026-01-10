// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Creamos el objeto Stack
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Definimos las rutas. "name" es la clave que usas en navigation.navigate('...') */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Para que no salga la barra arriba en el login
        />
        
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Crear Cuenta' }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}