import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styles from './Styles';

function App({ navigation }) {
  return (
    <View style={styles.container_padrao}>
      <View>
        <Text style={[styles.texto_padrao, { fontSize: 38, marginBottom: 50 }]}>
          <Text style={{ color: '#3498DB', fontWeight: 'bold' }}>Acesse</Text>{' '}
          <Text style={{ fontWeight: 'bold' }}>cidade</Text>
        </Text>
      </View>

      <View>
        <TextInput
          style={styles.input_contato}
          placeholder="Email"
          placeholderTextColor="gray"
        />

        <TextInput
          style={styles.input_contato}
          placeholder="Senha"
          placeholderTextColor="gray"
          secureTextEntry={true}
        />
      </View>

      <View style={styles.conteiner_botao}>
        <TouchableOpacity
          style={styles.botao_padrao}
          onPress={() => alert('Login')}>
          <Text
            style={[
              styles.texto_padrao,
              { fontWeight: 'bold', color: 'white' },
            ]}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
          <Text style={{ color: '#4A90E2', textDecorationLine: 'underline' }}>
            Faça seu cadastro
          </Text>
        </TouchableOpacity>

        <Text> | </Text>

        <TouchableOpacity onPress={() => navigation.navigate('TelaRecuperarSenha')}>
          <Text style={{ color: '#4A90E2', textDecorationLine: 'underline' }}>
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default App;
