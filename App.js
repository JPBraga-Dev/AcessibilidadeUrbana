import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './TelaLogin';
import TelaCadastro from './TelaCadastro';
import TelaRecuperarSenha from './TelaRecuperarSenha';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TelaCadastro" component={TelaCadastro} />
        <Stack.Screen name="TelaRecuperarSenha" component={TelaRecuperarSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
