import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import styles, { cores } from '../styles';
import { supabase } from '../lib/supabase';

function TelaRecuperarSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEnviarLink = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }

    setCarregando(true);
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: Linking.createURL('login') }
    );
    setCarregando(false);

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }

    Alert.alert(
      'Link enviado',
      'Verifique seu e-mail para redefinir a senha.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <View style={styles.container_padrao}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botao_voltar}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={cores.texto}
          />
        </TouchableOpacity>
        <Text style={styles.header_titulo}>Recuperar Senha</Text>
      </View>

      <MaterialCommunityIcons
        name="cellphone-key"
        size={64}
        color={cores.primaria}
        style={styles.icone_grande}
      />

      <Text style={styles.titulo_secao}>Esqueceu sua senha?</Text>
      <Text style={styles.descricao}>
        Digite seu e-mail para receber o link de recuperação.
      </Text>

      <View style={styles.campo}>
        <Text style={styles.label}>E-mail cadastrado</Text>
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

      <TouchableOpacity
        style={[
          styles.botao_primario,
          carregando && styles.botao_primario_desabilitado,
        ]}
        onPress={handleEnviarLink}
        disabled={carregando}>
        <Text style={styles.botao_primario_texto}>
          {carregando ? 'ENVIANDO...' : 'ENVIAR LINK'}
        </Text>
      </TouchableOpacity>

      <View style={styles.info_card}>
        <MaterialCommunityIcons
          name="information-outline"
          size={20}
          color={cores.primariaEscura}
        />
        <Text style={styles.info_card_texto}>
          Verifique sua caixa de entrada e spam após o envio.
        </Text>
      </View>
    </View>
  );
}

export default TelaRecuperarSenha;
