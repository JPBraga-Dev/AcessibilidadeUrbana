import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles, { cores } from '../styles';
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
    <View style={styles.container_centralizado}>
      <View style={styles.logo_circulo}>
        <MaterialCommunityIcons
          name="wheelchair-accessibility"
          size={56}
          color={cores.fundo}
        />
      </View>
      <Text style={styles.logo_titulo}>Acesse Cidade</Text>

      <Text style={[styles.descricao, { textAlign: 'center', fontSize: 16 }]}>
        Olá, {nome}!
      </Text>

      <TouchableOpacity style={styles.botao_primario} onPress={confirmarSair}>
        <Text style={styles.botao_primario_texto}>SAIR</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TelaHome;
