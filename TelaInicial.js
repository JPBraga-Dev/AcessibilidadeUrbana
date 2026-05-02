import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export default function App() {
  return (
    <View style={styles.container}>

      
      <View style={styles.header}>
        <Text style={styles.headerText}>Mapa de Acessibilidade</Text>
      </View>

      <View style={styles.mapContainer}>
        <iframe
          title="mapa"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-38.60,-3.80,-38.45,-3.65&layer=mapnik&marker=-3.7319,-38.5267"
          style={styles.iframe}
        />
      </View>

      <View style={styles.filters}>
        {["Todos", "Rampas", "Calçadas", "4+"].map((item, i) => (
          <View key={i} style={styles.filterBtn}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      
      <View style={styles.footer}>
        {["Início", "Mapa", "Avaliar", "Ranking", "Perfil"].map((item, i) => (
          <Text key={i} style={styles.footerText}>{item}</Text>
        ))}
      </View>

    </View>
  );
}