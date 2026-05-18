/**
 * Tela 4 — Busca / Listagem de Estabelecimentos
 *
 * Placeholder estilizado. Esta tela deve exibir:
 *  - Campo de busca por nome ou endereço
 *  - Filtros por categoria (Praça, Escola, Hospital…)
 *  - Filtro por nível de acessibilidade (verde / laranja / vermelho)
 *  - Lista paginada de resultados com nome, categoria, endereço e nota média
 *
 * Backend necessário:
 *  GET /places?search=<termo>&category=<cat>&level=<green|orange|red>&page=<n>
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../styles';

// ── Skeleton de card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <View style={s.skCard}>
      <View style={s.skIcone} />
      <View style={s.skTextos}>
        <View style={s.skLinha} />
        <View style={[s.skLinha, { width: '55%', marginTop: 6 }]} />
      </View>
    </View>
  );
}

// ── Tela principal ────────────────────────────────────────────────────────────
function TelaBusca({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Buscar Locais</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Barra de busca (visual apenas) */}
      <View style={s.buscaBox}>
        <MaterialCommunityIcons name="magnify" size={20} color={cores.textoSecundario} />
        <Text style={s.buscaPlaceholder}>Nome, endereço, categoria…</Text>
      </View>

      {/* Filtros de categoria (visual apenas) */}
      <View style={s.filtrosRow}>
        {['Todos', 'Praça', 'Escola', 'Hospital', 'Comércio'].map((f, i) => (
          <View key={f} style={[s.chip, i === 0 && s.chipAtivo]}>
            <Text style={[s.chipTexto, i === 0 && s.chipTextoAtivo]}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Conteúdo principal — Em desenvolvimento */}
      <View style={s.corpo}>
        <View style={s.bannerDev}>
          <MaterialCommunityIcons name="wrench-clock" size={48} color={cores.primaria} />
          <Text style={s.bannerTitulo}>Busca em desenvolvimento</Text>
          <Text style={s.bannerDesc}>
            Esta tela (Tela 4) permitirá pesquisar e filtrar estabelecimentos
            por nome, categoria e nível de acessibilidade.{'\n\n'}
            Enquanto isso, você pode explorar os locais pela aba{' '}
            <Text style={{ fontWeight: '700', color: cores.primaria }}>Início</Text>
            {' '}ou pelo{' '}
            <Text style={{ fontWeight: '700', color: cores.primaria }}>Mapa</Text>.
          </Text>
        </View>

        {/* Skeletons ilustrativos */}
        <Text style={s.skTitulo}>Pré-visualização dos resultados:</Text>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  // Header
  header: {
    backgroundColor: cores.primariaEscura,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitulo: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Barra de busca
  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buscaPlaceholder: { color: cores.textoSecundario, fontSize: 15 },

  // Filtros
  filtrosRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: '#fff',
  },
  chipAtivo:     { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto:     { fontSize: 12, color: cores.texto, fontWeight: '600' },
  chipTextoAtivo:{ color: '#fff' },

  // Corpo
  corpo: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Banner de em desenvolvimento
  bannerDev: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: cores.primaria,
  },
  bannerTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 12,
    marginBottom: 10,
  },
  bannerDesc: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: 'center',
    lineHeight: 21,
  },

  // Skeletons
  skTitulo: {
    fontSize: 13,
    fontWeight: '600',
    color: cores.textoSecundario,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  skCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    opacity: 0.5,
  },
  skIcone: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: cores.borda,
  },
  skTextos: { flex: 1 },
  skLinha: {
    height: 12,
    borderRadius: 6,
    backgroundColor: cores.borda,
    width: '75%',
  },
});

export default TelaBusca;
