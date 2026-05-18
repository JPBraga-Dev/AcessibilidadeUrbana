import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@acessivel:token';
const USER_KEY  = '@acessivel:user';

const AuthContext = createContext({
  user: null,
  token: null,
  carregandoSessao: true,
  entrar: async () => {},
  sair: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser]                   = useState(null);
  const [token, setToken]                 = useState(null);
  const [carregandoSessao, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(TOKEN_KEY);
      const u = await AsyncStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
      setCarregando(false);
    })();
  }, []);

  const entrar = async (tokenRecebido, userRecebido) => {
    await AsyncStorage.setItem(TOKEN_KEY, tokenRecebido);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userRecebido));
    setToken(tokenRecebido);
    setUser(userRecebido);
  };

  const sair = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, carregandoSessao, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
