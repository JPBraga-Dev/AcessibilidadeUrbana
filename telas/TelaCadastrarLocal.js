import { useState, useEffect } from 'react';
import {
  Text, View, TextInput, TouchableOpacity,
  Alert, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { cores } from '../styles';
import { placesApi, rankingApi } from '../lib/api';

const CATEGORIAS = ['Praça', 'Prédio', 'Rua', 'Escola', 'Hospital', 'Comércio', 'Outro'];

function TelaCadastrarLocal({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nome, setNome]             = useState('');
  const [categoria, setCategoria]   = useState('');
  const [endereco, setEndereco]     = useState('');
  const [latitude, setLatitude]     = useState('');
  const [longitude, setLongitude]   = useState('');
  const [regiaoId, setRegiaoId]     = useState(null);
  const [regioes, setRegioes]       = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [buscandoGPS, setBuscandoGPS] = useState(false);

  useEffect(() => {
    rankingApi.regioes()
      .then(setRegioes)
      .catch(() => {});
  }, []);

  // ── Localização atual ──────────────────────────────────────────────────────
  const usarLocalizacaoAtual = async () => {
    setBuscandoGPS(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de acesso à sua localização. Habilite nas configurações do dispositivo.',
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = loc.coords.latitude.toFixed(6);
      const lon = loc.coords.longitude.toFixed(6);

      setLatitude(lat);
      setLongitude(lon);

      // Tenta preencher o endereço via geocodificação reversa
      try {
        const [place] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (place) {
          const partes = [
            place.street,
            place.streetNumber,
            place.district,
            place.city,
          ].filter(Boolean);
          if (partes.length > 0 && !endereco) {
            setEndereco(partes.join(', '));
          }
        }
      } catch {
        // geocodificação falhou — lat/lon já preenchidos, ok
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível obter a localização: ' + err.message);
    } finally {
      setBuscandoGPS(false);
    }
  };

  // ── Salvar ─────────────────────────────────────────────────────────────────
  const handleSalvar = async () => {
    if (!nome.trim() || !categoria || !endereco.trim() || !latitude || !longitude) {
      Alert.alert('Atenção', 'Preencha nome, categoria, endereço, latitude e longitude.');
      return;
    }
    const lat = parseFloat(latitude.replace(',', '.'));
    const lon = parseFloat(longitude.replace(',', '.'));
    if (isNaN(lat) || isNaN(lon)) {
      Alert.alert('Atenção', 'Latitude e longitude devem ser números válidos.');
      return;
    }

    setCarregando(true);
    try {
      await placesApi.criar({
        name:      nome.trim(),
        category:  categoria.toLowerCase(),
        address:   endereco.trim(),
        latitude:  lat,
        longitude: lon,
        region_id: regiaoId ?? undefined,
      });
      Alert.alert('Sucesso', 'Local cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            setNome('');
            setCategoria('');
            setEndereco('');
            setLatitude('');
            setLongitude('');
            setRegiaoId(null);
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setCarregando(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      {/* Header fixo */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={cores.fundo} />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Cadastrar Local</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={s.corpo}>

          {/* Nome */}
          <Text style={s.label}>Nome do local *</Text>
          <TextInput
            style={s.input}
            placeholder="Ex: Praça do Ferreira"
            placeholderTextColor={cores.textoSecundario}
            value={nome}
            onChangeText={setNome}
          />

          {/* Categoria */}
          <Text style={s.label}>Categoria *</Text>
          <View style={s.chips}>
            {CATEGORIAS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategoria(c)}
                style={[s.chip, categoria === c && s.chipAtivo]}>
                <Text style={[s.chipTexto, categoria === c && s.chipTextoAtivo]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Endereço */}
          <Text style={s.label}>Endereço *</Text>
          <TextInput
            style={s.input}
            placeholder="Rua, número, bairro"
            placeholderTextColor={cores.textoSecundario}
            value={endereco}
            onChangeText={setEndereco}
          />

          {/* Coordenadas */}
          <View style={s.coordHeader}>
            <Text style={s.label}>Coordenadas *</Text>
            <TouchableOpacity
              style={[s.gpsBtn, buscandoGPS && { opacity: 0.7 }]}
              onPress={usarLocalizacaoAtual}
              disabled={buscandoGPS}>
              {buscandoGPS ? (
                <ActivityIndicator size="small" color={cores.primaria} />
              ) : (
                <>
                  <MaterialCommunityIcons name="crosshairs-gps" size={16} color={cores.primaria} />
                  <Text style={s.gpsBtnTexto}>Usar localização atual</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Indicador de GPS preenchido */}
          {latitude !== '' && longitude !== '' && (
            <View style={s.gpsPreenchido}>
              <MaterialCommunityIcons name="map-marker-check" size={16} color={cores.primaria} />
              <Text style={s.gpsPreenchidoTexto}>
                {latitude}, {longitude}
              </Text>
            </View>
          )}

          <View style={s.linha}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={s.labelSmall}>Latitude</Text>
              <TextInput
                style={s.input}
                placeholder="-3.7319"
                placeholderTextColor={cores.textoSecundario}
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.labelSmall}>Longitude</Text>
              <TextInput
                style={s.input}
                placeholder="-38.5267"
                placeholderTextColor={cores.textoSecundario}
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Região */}
          {regioes.length > 0 && (
            <>
              <Text style={s.label}>Região</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}>
                {[{ id: null, name: 'Nenhuma' }, ...regioes].map((r) => (
                  <TouchableOpacity
                    key={String(r.id)}
                    onPress={() => setRegiaoId(r.id)}
                    style={[s.chip, regiaoId === r.id && s.chipAtivo, { marginRight: 8 }]}>
                    <Text style={[s.chipTexto, regiaoId === r.id && s.chipTextoAtivo]}>
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          {/* Botão salvar */}
          <TouchableOpacity
            style={[s.botao, carregando && { opacity: 0.7 }]}
            onPress={handleSalvar}
            disabled={carregando}>
            {carregando
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.botaoTexto}>CADASTRAR LOCAL</Text>
            }
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: cores.fundo },
  header:       { backgroundColor: cores.primariaEscura, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitulo: { color: cores.fundo, fontSize: 18, fontWeight: 'bold' },
  corpo:        { padding: 20 },

  label:        { fontSize: 13, fontWeight: '600', color: cores.texto, marginBottom: 6, marginTop: 16 },
  labelSmall:   { fontSize: 13, fontWeight: '600', color: cores.texto, marginBottom: 6, marginTop: 8 },
  input:        { borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: cores.texto, backgroundColor: '#fff' },

  chips:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip:         { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: cores.borda, backgroundColor: '#fff' },
  chipAtivo:    { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto:    { fontSize: 13, color: cores.texto },
  chipTextoAtivo: { color: '#fff', fontWeight: '600' },

  // Coordenadas
  coordHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  gpsBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.primaria + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  gpsBtnTexto:      { fontSize: 12, fontWeight: '700', color: cores.primaria },
  gpsPreenchido:    { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.primaria + '12', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 6, marginBottom: 4 },
  gpsPreenchidoTexto: { fontSize: 12, color: cores.primaria, fontWeight: '600' },

  linha:        { flexDirection: 'row' },
  botao:        { marginTop: 28, backgroundColor: cores.primaria, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  botaoTexto:   { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 },
});

export default TelaCadastrarLocal;
