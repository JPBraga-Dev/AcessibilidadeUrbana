import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles, { cores } from '../styles';

function TelaPlaceholder({ route }) {
  const titulo = route?.params?.titulo ?? 'Em breve';
  const icone = route?.params?.icone ?? 'tools';

  return (
    <View style={[styles.container_centralizado, { alignItems: 'center' }]}>
      <MaterialCommunityIcons name={icone} size={64} color={cores.primaria} />
      <Text style={[styles.titulo_secao, { marginTop: 16 }]}>{titulo}</Text>
      <Text style={styles.descricao}>Esta tela está em desenvolvimento.</Text>
    </View>
  );
}

export default TelaPlaceholder;
