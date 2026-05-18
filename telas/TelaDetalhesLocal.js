import { useEffect, useState, useCallback } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../styles';
import { placesApi } from '../lib/api';

// ──────────────────────────────────────────────
// Mapa de critérios
// ──────────────────────────────────────────────
const CRITERIOS = [
  { key: 'ramp',                label: 'Rampa',          icone: 'wheelchair-accessibility' },
  { key: 'tactile_floor',       label: 'Piso tátil',     icone: 'dots-grid' },
  { key: 'sidewalk',            label: 'Calçada',        icone: 'road-variant' },
  { key: 'accessible_bathroom', label: 'Banheiro',       icone: 'toilet' },
  { key: 'sound_signaling',     label: 'Sin. sonora',    icone: 'volume-high' },
  { key: 'disabled_parking',    label: 'Vaga PCD',       icone: 'parking' },
  { key: 'elevator',            label: 'Elevador',       icone: 'elevator' },
];

// ──────────────────────────────────────────────
// Componente de estrelas
// ──────────────────────────────────────────────
function Estrelas({ valor, tamanho = 16 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MaterialCommunityIcons
          key={n}
          name={n <= Math.round(valor) ? 'star' : 'star-outline'}
          size={tamanho}
          color="#F59E0B"
        />
      ))}
    </View>
  );
}

// ──────────────────────────────────────────────
// Card de comentário
// ──────────────────────────────────────────────
function CardComentario({ review }) {
  const nome  = review.profiles?.name ?? 'Usuário';
  const letra = nome.charAt(0).toUpperCase();

  return (
    <View style={s.comentarioCard}>
      <View style={s.comentarioAvatar}>
        <Text style={s.comentarioLetra}>{letra}</Text>
      </View>
      <View style={s.comentarioCorpo}>
        <Text style={s.comentarioNome}>{nome}</Text>
        {review.comment ? (
          <Text style={s.comentarioTexto} numberOfLines={2}>{review.comment}</Text>
        ) : null}
        <Estrelas valor={review.rating} tamanho={14} />
      </View>
    </View>
  );
}

// ──────────────────────────────────────────────
// Tela principal
// ──────────────────────────────────────────────
function TelaDetalhesLocal({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { local } = route.params;

  const [summary, setSummary]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi]   = useState(false);

  const buscar = useCallback(async () => {
    setCarregando(true);
    setErroApi(false);
    try {
      const [sum, revs] = await Promise.all([
        placesApi.summary(local.id),
        placesApi.reviews(local.id),
      ]);
      setSummary(sum);
      setReviews(revs ?? []);
    } catch {
      setSummary(null);
      setErroApi(true);
    } finally {
      setCarregando(false);
    }
  }, [local.id]);

  useEffect(() => { buscar(); }, [buscar]);

  const info      = summary ?? local;
  const avgRating = Number(info.avg_rating ?? 0);
  const nivel     = summary?.accessibility_level ?? (avgRating >= 4 ? 'green' : avgRating >= 2.5 ? 'orange' : 'red');
  const nivelLabel = summary?.accessibility_label ?? (nivel === 'green' ? 'Acessível' : nivel === 'orange' ? 'Parcialmente acessível' : 'Pouco acessível');
  const nivelCor  = { green: cores.primaria, orange: '#E67E22', red: '#DC2626' }[nivel];

  const criteriosAtivos = CRITERIOS.filter((c) => summary?.criteria?.[c.key]);

  const cabecalho = (
    <>
      {/* Banner de aviso quando API falha */}
      {erroApi && (
        <View style={s.erroBanner}>
          <MaterialCommunityIcons name="wifi-off" size={14} color="#92400E" />
          <Text style={s.erroBannerTexto}>Dados podem estar desatualizados.</Text>
          <TouchableOpacity onPress={buscar}>
            <Text style={s.erroBannerLink}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Card de informações do local */}
      <View style={s.placeCard}>
        <Text style={s.placeNome}>{info.name}</Text>
        <View style={s.placeEnderecoLinha}>
          <MaterialCommunityIcons name="map-marker-outline" size={14} color={cores.textoSecundario} />
          <Text style={s.placeEndereco} numberOfLines={1}>
            {info.region_name ? `${info.region_name} · ` : ''}{info.address}
          </Text>
        </View>

        <View style={s.ratingLinha}>
          <Estrelas valor={avgRating} tamanho={18} />
          <Text style={s.ratingNumero}>{avgRating.toFixed(1)}</Text>
          <Text style={s.avaliacaoCount}>{summary?.review_count ?? reviews.length} avaliações</Text>
          <View style={[s.nivelBadge, { borderColor: nivelCor }]}>
            <Text style={[s.nivelBadgeTexto, { color: nivelCor }]}>{nivelLabel}</Text>
          </View>
        </View>
      </View>

      {/* Critérios avaliados */}
      {criteriosAtivos.length > 0 && (
        <View style={s.secao}>
          <Text style={s.secaoTitulo}>Critérios avaliados:</Text>
          <View style={s.criteriosWrap}>
            {criteriosAtivos.map((c) => (
              <View key={c.key} style={s.criterioChip}>
                <MaterialCommunityIcons name={c.icone} size={14} color="#fff" />
                <Text style={s.criterioChipTexto}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Cabeçalho dos comentários */}
      <Text style={[s.secaoTitulo, { marginHorizontal: 16, marginTop: 24, marginBottom: 8 }]}>
        Comentários
      </Text>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}>

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Detalhe do Local</Text>
        <View style={{ width: 24 }} />
      </View>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 48 }} size="large" color={cores.primaria} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={cabecalho}
          renderItem={({ item }) => <CardComentario review={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            <View style={s.vazio}>
              <MaterialCommunityIcons name="comment-outline" size={40} color={cores.textoSecundario} />
              <Text style={s.vazioTexto}>Nenhum comentário ainda. Seja o primeiro!</Text>
            </View>
          }
        />
      )}

      {/* Barra inferior — adicionar comentário */}
      <View style={[s.barraInferior, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={s.inputFake}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Avaliar', { local: info })}>
          <Text style={s.inputFakeTexto}>Adicionar comentário...</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.botaoEnviar}
          onPress={() => navigation.navigate('Avaliar', { local: info })}>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────────────────
// Estilos
// ──────────────────────────────────────────────
const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F3F4F6' },

  // Header
  header:       { backgroundColor: cores.primariaEscura, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  headerTitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  // Banner de erro
  erroBanner:      { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF3C7', marginHorizontal: 16, marginTop: 12, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  erroBannerTexto: { flex: 1, fontSize: 12, color: '#92400E' },
  erroBannerLink:  { fontSize: 12, fontWeight: '700', color: '#92400E', textDecorationLine: 'underline' },

  // Card do local
  placeCard:    { backgroundColor: '#fff', borderRadius: 16, margin: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  placeNome:    { fontSize: 22, fontWeight: 'bold', color: cores.texto, marginBottom: 6 },
  placeEnderecoLinha: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  placeEndereco:{ fontSize: 14, color: cores.textoSecundario, flex: 1 },
  ratingLinha:  { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  ratingNumero: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  avaliacaoCount: { fontSize: 13, color: cores.textoSecundario },
  nivelBadge:   { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  nivelBadgeTexto: { fontSize: 13, fontWeight: '600' },

  // Critérios
  secao:        { paddingHorizontal: 16 },
  secaoTitulo:  { fontSize: 16, fontWeight: 'bold', color: cores.texto, marginBottom: 12 },
  criteriosWrap:{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  criterioChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: cores.primaria, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  criterioChipTexto: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Cards de comentário
  comentarioCard:  { backgroundColor: '#fff', borderRadius: 14, marginHorizontal: 16, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  comentarioAvatar:{ width: 42, height: 42, borderRadius: 21, backgroundColor: cores.primaria, justifyContent: 'center', alignItems: 'center' },
  comentarioLetra: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  comentarioCorpo: { flex: 1 },
  comentarioNome:  { fontSize: 15, fontWeight: '600', color: cores.texto, marginBottom: 4 },
  comentarioTexto: { fontSize: 13, color: cores.textoSecundario, marginBottom: 6, lineHeight: 19 },

  // Barra inferior
  barraInferior:{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, gap: 10, borderTopWidth: 1, borderTopColor: cores.borda + '40' },
  inputFake:    { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 13 },
  inputFakeTexto: { color: cores.textoSecundario, fontSize: 15 },
  botaoEnviar:  { width: 46, height: 46, borderRadius: 23, backgroundColor: cores.primaria, justifyContent: 'center', alignItems: 'center' },

  // Vazio
  vazio:        { alignItems: 'center', paddingTop: 32, paddingHorizontal: 24 },
  vazioTexto:   { color: cores.textoSecundario, marginTop: 10, textAlign: 'center', fontSize: 14 },
});

export default TelaDetalhesLocal;
