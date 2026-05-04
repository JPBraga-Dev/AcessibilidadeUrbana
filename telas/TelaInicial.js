import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../styles';
import { mapaApi } from '../lib/api';

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'rampas', label: 'Rampas' },
  { id: 'calcadas', label: 'Calçadas' },
  { id: '4estrelas', label: '4★+' },
];

const REGIAO_INICIAL = {
  latitude: -3.7319,
  longitude: -38.5267,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const LOCAIS_MOCK = [
  { id: 'm1', name: 'Praça do Ferreira', avg_rating: 4.5, accessibility_level: 'green', latitude: -3.7280, longitude: -38.5270 },
  { id: 'm2', name: 'Mercado Central', avg_rating: 4.2, accessibility_level: 'green', latitude: -3.7295, longitude: -38.5180 },
  { id: 'm3', name: 'Catedral Metropolitana', avg_rating: 3.0, accessibility_level: 'orange', latitude: -3.7320, longitude: -38.5240 },
  { id: 'm4', name: 'Theatro José de Alencar', avg_rating: 3.8, accessibility_level: 'green', latitude: -3.7290, longitude: -38.5320 },
  { id: 'm5', name: 'Passeio Público', avg_rating: 2.0, accessibility_level: 'red', latitude: -3.7345, longitude: -38.5290 },
];

const corDoNivel = {
  green: cores.primaria,
  orange: '#E67E22',
  red: '#DC2626',
};

function TelaInicial() {
  const insets = useSafeAreaInsets();
  const [locais, setLocais] = useState(LOCAIS_MOCK);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    let cancelado = false;
    mapaApi
      .listar(filtro)
      .then((dados) => {
        if (!cancelado && dados?.length) setLocais(dados);
      })
      .catch((err) => console.warn('[mapa] API offline, usando mock:', err.message));
    return () => {
      cancelado = true;
    };
  }, [filtro]);


  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Text style={s.headerTitulo}>Mapa de Acessibilidade</Text>
      </View>

      <View style={s.mapaWrapper}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={s.mapa}
          initialRegion={REGIAO_INICIAL}>
          {locais.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.name}
              description={`Avaliação: ${p.avg_rating}`}>
              <View
                style={[
                  s.marker,
                  { backgroundColor: corDoNivel[p.accessibility_level] },
                ]}>
                <MaterialCommunityIcons
                  name={
                    p.accessibility_level === 'red'
                      ? 'alert'
                      : 'cellphone'
                  }
                  size={14}
                  color={cores.fundo}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      <View style={s.filtros}>
        {FILTROS.map((f) => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setFiltro(f.id)}
            style={[
              s.filtroChip,
              filtro === f.id && s.filtroChipAtivo,
            ]}>
            <Text
              style={[
                s.filtroTexto,
                filtro === f.id && s.filtroTextoAtivo,
              ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.legenda}>
        <View style={s.legendaItem}>
          <View style={[s.legendaBolinha, { backgroundColor: cores.primaria }]} />
          <Text style={s.legendaTexto}>Acessível</Text>
        </View>
        <View style={s.legendaItem}>
          <View style={[s.legendaBolinha, { backgroundColor: '#DC2626' }]} />
          <Text style={s.legendaTexto}>Crítico</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  header: {
    backgroundColor: cores.primariaEscura,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitulo: {
    color: cores.fundo,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mapaWrapper: { flex: 1 },
  mapa: { flex: 1 },
  marker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: cores.fundo,
  },
  filtros: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
  },
  filtroChipAtivo: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  filtroTexto: { color: cores.texto, fontSize: 13, fontWeight: '600' },
  filtroTextoAtivo: { color: cores.fundo },
  legenda: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 16,
  },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaBolinha: { width: 10, height: 10, borderRadius: 5 },
  legendaTexto: { fontSize: 12, color: cores.textoSecundario },
});

export default TelaInicial;
