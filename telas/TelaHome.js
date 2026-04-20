import { Text, View, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles';
import { useAuth } from '../contexts/AuthContext';

function TelaHome() {
  const { user, sair } = useAuth();

  const nome = user?.user_metadata?.nome ?? user?.email ?? 'usuário';

  const confirmarSair = () => {
    Alert.alert('Sair', 'Deseja mesmo encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  };

  return (
    <View style={styles.container_padrao}>
      <View>
        <Text style={[styles.texto_padrao, { fontSize: 38, marginBottom: 20 }]}>
          <Text style={{ color: '#3498DB', fontWeight: 'bold' }}>Acesse</Text>{' '}
          <Text style={{ fontWeight: 'bold' }}>cidade</Text>
        </Text>
      </View>

      <Text
        style={[
          styles.texto_padrao,
          { fontSize: 18, marginBottom: 40, textAlign: 'center' },
        ]}>
        Olá, {nome}!
      </Text>

      <View style={styles.conteiner_botao}>
        <TouchableOpacity style={styles.botao_padrao} onPress={confirmarSair}>
          <Text
            style={[
              styles.texto_padrao,
              { fontWeight: 'bold', color: 'white' },
            ]}>
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TelaHome;
