import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import styles, { cores } from '../styles';
import { supabase } from '../lib/supabase';

function TelaCriarConta({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleCriarConta = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }
    if (!aceitouTermos) {
      Alert.alert('Atenção', 'Você precisa aceitar os Termos de Uso.');
      return;
    }

    setCarregando(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        data: { nome: nome.trim() },
        emailRedirectTo: Linking.createURL('login'),
      },
    });
    setCarregando(false);

    if (error) {
      Alert.alert('Erro ao criar conta', error.message);
      return;
    }

    if (!data.session) {
      Alert.alert(
        'Confirme seu e-mail',
        'Enviamos um link de confirmação para o seu e-mail.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  return (
    <ScrollView
      style={styles.container_padrao}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled">
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
        <Text style={styles.header_titulo}>Criar Conta</Text>
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor={cores.textoSecundario}
          value={nome}
          onChangeText={setNome}
          autoCorrect={false}
        />
      </View>

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

      <View style={styles.campo}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 8 caracteres"
          placeholderTextColor={cores.textoSecundario}
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </View>

      <View style={styles.campo}>
        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha"
          placeholderTextColor={cores.textoSecundario}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.termos_linha}
        onPress={() => setAceitouTermos(!aceitouTermos)}
        activeOpacity={0.7}>
        <View
          style={[styles.checkbox, aceitouTermos && styles.checkbox_marcado]}>
          {aceitouTermos && (
            <MaterialCommunityIcons
              name="check"
              size={14}
              color={cores.fundo}
            />
          )}
        </View>
        <Text style={styles.termos_texto}>
          Aceito os{' '}
          <Text style={styles.termos_link}>
            Termos de Uso e Política de Privacidade
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botao_primario,
          carregando && styles.botao_primario_desabilitado,
        ]}
        onPress={handleCriarConta}
        disabled={carregando}>
        <Text style={styles.botao_primario_texto}>
          {carregando ? 'CADASTRANDO...' : 'CADASTRAR'}
        </Text>
      </TouchableOpacity>

      <View style={styles.rodape}>
        <Text style={styles.rodape_texto}>Já tem conta?</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.rodape_link}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default TelaCriarConta;
