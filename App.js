import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import TelaLogin from './telas/TelaLogin';
import TelaCriarConta from './telas/TelaCriarConta';
import TelaRecuperarSenha from './telas/TelaRecuperarSenha';
import TelaInicial from './telas/TelaInicial';
import TelaHome from './telas/TelaHome';
import TelaPlaceholder from './telas/TelaPlaceholder';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { cores } from './styles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: { paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, marginBottom: 2 },
      }}>
      <Tab.Screen
        name="Inicio"
        component={TelaHome}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={TelaInicial}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Avaliar"
        component={TelaPlaceholder}
        initialParams={{ titulo: 'Avaliar', icone: 'star-outline' }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Ranking"
        component={TelaPlaceholder}
        initialParams={{ titulo: 'Ranking', icone: 'trophy-outline' }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaPlaceholder}
        initialParams={{ titulo: 'Perfil', icone: 'account-outline' }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Rotas() {
  const { session, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen name="App" component={TabsApp} />
      ) : (
        <>
          <Stack.Screen name="Login" component={TelaLogin} />
          <Stack.Screen name="CriarConta" component={TelaCriarConta} />
          <Stack.Screen name="RecuperarSenha" component={TelaRecuperarSenha} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Rotas />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
