import React from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import styles from './Styles';

function App({ navigation }) {
  return (
    <View style={styles.container_padrao}>
      <View>
        <Text style={[styles.texto_padrao, { fontSize: 36, marginBottom: 10 }]}>
          <Text style={{ fontWeight: 'bold' }}>Recuperar Senha</Text>
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Text
          style={[
            styles.texto_padrao,
            {
              fontSize: 14,
              marginBottom: 40,
              fontWeight: 'normal',
              textAlign: 'center',
            },
          ]}>
          Para Recuperar sua senha, digite seu e-mail {'\n'} usado durante seu
          cadastro
        </Text>
      </View>

      <View>
        <TextInput
          style={styles.input_contato}
          placeholder="Email Cadastrado"
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.conteiner_botao}>
        <TouchableOpacity
          style={styles.botao_padrao}
          onPress={() => alert('link de recuperação foi enviado a seu email')}>
          <Text
            style={[
              styles.texto_padrao,
              { fontWeight: 'bold', color: 'white' },
            ]}>
            Recuperar Senha
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default App;
