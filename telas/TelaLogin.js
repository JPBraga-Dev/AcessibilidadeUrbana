import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles, { cores } from '../styles';
import { supabase } from '../lib/supabase';

function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    setCarregando(false);

    if (error) {
      Alert.alert('Erro ao entrar', error.message);
    }
  };

  return (
    <View style={styles.container_centralizado}>
      <View style={styles.logo_circulo}>
        <MaterialCommunityIcons
          name="wheelchair-accessibility"
          size={56}
          color={cores.fundo}
        />
      </View>
      <Text style={styles.logo_titulo}>Acesse Cidade</Text>

      <View style={styles.campo}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor={cores.textoSecundario}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={cores.textoSecundario}
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.link_direita}
          onPress={() => navigation.navigate('RecuperarSenha')}>
          <Text style={styles.link_texto}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.botao_primario,
          carregando && styles.botao_primario_desabilitado,
        ]}
        onPress={handleLogin}
        disabled={carregando}>
        <Text style={styles.botao_primario_texto}>
          {carregando ? 'ENTRANDO...' : 'ENTRAR'}
        </Text>
      </TouchableOpacity>

      <View style={styles.rodape}>
        <Text style={styles.rodape_texto}>Não tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CriarConta')}>
          <Text style={styles.rodape_link}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TelaLogin;
