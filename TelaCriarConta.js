import {
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import styles from './Styles';
function App() {
  return (
    <View style={styles.container_padrao}>

    <view style={styles.container_icone_voltar_contato}>
      <TouchableOpacity onPress= {() => navigation.goBack()}>
        <MaterialCommunityIcons
          name = "keyboard-backspace"
          size={40}
          color = "blue"
        />  
      </TouchableOpacity>
    
    
    
    </view>

      <View>
        <Text style={[styles.texto_padrao, { fontSize: 38, marginBottom: 50 }]}>
          <Text style={{ color: '#3498DB', fontWeight: 'bold' }}>Acesse</Text>{' '}
          <Text style={{ fontWeight: 'bold' }}>cidade</Text>
        </Text>
      </View>

      <View>
        <TextInput
          style={styles.input_contato}
          placeholder="Nome Completo"
          placeholderTextColor="gray"
        />

        <TextInput
          style={styles.input_contato}
          placeholder="Email"
          placeholderTextColor="gray"
        />

        <TextInput
          style={styles.input_contato}
          placeholder="Senha"
          placeholderTextColor="gray"
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
            Cria Conta
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
export default App;
