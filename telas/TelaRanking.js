import { useEffect, useState, useCallback } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../styles';
import { rankingApi } from '../lib/api';

const MEDALHA = { 1: '🥇', 2: '🥈', 3: '🥉' };

function CardRanking({ item, onVerDetalhes }) {
  const corNota = item.avg_rating >= 4 ? cores.primaria : item.avg_rating >= 2.5 ? '#E67E22' : '#DC2626';

  return (
    <TouchableOpacity style={s.card} onPress={() => onVerDetalhes(item)} activeOpacity={0.8}>
      <Text style={s.medalha}>{MEDALHA[item.rank] ?? `#${item.rank}`}</Text>
      <View style={s.cardInfo}>
        <Text style={s.cardNome} numberOfLines={1}>{item.place_name}</Text>
        <Text style={s.cardRegiao}>{item.region_name ?? 'Sem região'}</Text>
      </View>
      <View style={s.notaBox}>
        <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
        <Text style={[s.nota, { color: corNota }]}>{Number(item.avg_rating).toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function TelaRanking({ navigation }) {
  const insets = useSafeAreaInsets();
  const [ranking, setRanking]       = useState([]);
  const [regioes, setRegioes]       = useState([]);
  const [regiaoSel, setRegiaoSel]   = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba]               = useState('ranking'); // 'ranking' | 'stats'
  const [stats, setStats]           = useState([]);

  const buscarRegioes = useCallback(async () => {
    try {
      const dados = await rankingApi.regioes();
      setRegioes(dados ?? []);
    } catch { /* ignora se backend offline */ }
  }, []);

  const buscarRanking = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await rankingApi.porRegiao(regiaoSel);
      setRanking(dados ?? []);
    } catch (e) {
      setRanking([]);
    } finally {
      setCarregando(false);
    }
  }, [regiaoSel]);

  const buscarStats = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await rankingApi.stats();
      setStats(dados ?? []);
    } catch {
      setStats([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarRegioes(); }, [buscarRegioes]);

  useEffect(() => {
    if (aba === 'ranking') buscarRanking();
    else buscarStats();
  }, [aba, buscarRanking, buscarStats]);

  const handleVerDetalhes = (item) => {
    navigation.navigate('DetalhesLocal', {
      local: {
        id:         item.place_id,
        name:       item.place_name,
        avg_rating: item.avg_rating,
        category:   item.category   ?? '',
        address:    item.address    ?? '',
        region_name: item.region_name ?? null,
      },
    });
  };

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Text style={s.headerTitulo}>Ranking & Estatísticas</Text>
      </View>

      <View style={s.abas}>
        {[['ranking', 'trophy-outline', 'Ranking'], ['stats', 'chart-bar', 'Estatísticas']].map(([id, icone, label]) => (
          <TouchableOpacity
            key={id}
            style={[s.aba, aba === id && s.abaAtiva]}
            onPress={() => setAba(id)}>
            <MaterialCommunityIcons name={icone} size={16} color={aba === id ? cores.primaria : cores.textoSecundario} />
            <Text style={[s.abaTexto, aba === id && s.abaTextoAtivo]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {aba === 'ranking' && (
        <>
          {regioes.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtroScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {[{ id: null, name: 'Todas' }, ...regioes].map((r) => (
                <TouchableOpacity
                  key={String(r.id)}
                  onPress={() => setRegiaoSel(r.name === 'Todas' ? null : r.name)}
                  style={[s.chip, (regiaoSel === r.name || (r.name === 'Todas' && !regiaoSel)) && s.chipAtivo]}>
                  <Text style={[s.chipTexto, (regiaoSel === r.name || (r.name === 'Todas' && !regiaoSel)) && s.chipTextoAtivo]}>
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {carregando
            ? <ActivityIndicator style={{ marginTop: 40 }} color={cores.primaria} />
            : (
              <FlatList
                data={ranking}
                keyExtractor={(item) => String(item.place_id)}
                renderItem={({ item }) => <CardRanking item={item} onVerDetalhes={handleVerDetalhes} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                ListEmptyComponent={
                  <View style={s.vazio}>
                    <MaterialCommunityIcons name="trophy-broken" size={48} color={cores.textoSecundario} />
                    <Text style={s.vazioTexto}>Nenhum local encontrado.</Text>
                  </View>
                }
              />
            )
          }
        </>
      )}

      {aba === 'stats' && (
        carregando
          ? <ActivityIndicator style={{ marginTop: 40 }} color={cores.primaria} />
          : (
            <FlatList
              data={stats}
              keyExtractor={(item) => String(item.region_id ?? item.region_name)}
              renderItem={({ item }) => (
                <View style={s.statsCard}>
                  <Text style={s.statsRegiao}>{item.region_name}</Text>
                  <View style={s.statsGrade}>
                    <View style={s.statItem}>
                      <Text style={s.statValor}>{item.total_places ?? 0}</Text>
                      <Text style={s.statLabel}>Locais</Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={s.statValor}>{item.total_reviews ?? 0}</Text>
                      <Text style={s.statLabel}>Avaliações</Text>
                    </View>
                    <View style={s.statItem}>
                      <Text style={[s.statValor, { color: cores.primaria }]}>
                        {item.avg_rating ? Number(item.avg_rating).toFixed(1) : '-'}
                      </Text>
                      <Text style={s.statLabel}>Média ★</Text>
                    </View>
                  </View>
                  <View style={s.criteriosGrade}>
                    {[
                      ['Rampas', item.total_ramp], ['Calçadas', item.total_sidewalk],
                      ['Son. sonora', item.total_sound_signaling], ['Piso tátil', item.total_tactile_floor],
                      ['Vaga PCD', item.total_disabled_parking], ['Elevador', item.total_elevator],
                      ['Banheiro', item.total_accessible_bathroom],
                    ].map(([label, val]) => (
                      <View key={label} style={s.criterioStat}>
                        <Text style={s.criterioStatVal}>{val ?? 0}</Text>
                        <Text style={s.criterioStatLabel}>{label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
              ListEmptyComponent={
                <View style={s.vazio}>
                  <MaterialCommunityIcons name="chart-bar" size={48} color={cores.textoSecundario} />
                  <Text style={s.vazioTexto}>Nenhuma estatística disponível.</Text>
                </View>
              }
            />
          )
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: cores.fundo },
  header:       { backgroundColor: cores.primariaEscura, paddingHorizontal: 20, paddingBottom: 14 },
  headerTitulo: { color: cores.fundo, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  abas:         { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: cores.borda },
  aba:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  abaAtiva:     { borderBottomWidth: 2, borderBottomColor: cores.primaria },
  abaTexto:     { fontSize: 14, color: cores.textoSecundario },
  abaTextoAtivo:{ color: cores.primaria, fontWeight: '700' },
  filtroScroll: { maxHeight: 52, marginVertical: 8 },
  chip:         { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: cores.borda, backgroundColor: '#fff' },
  chipAtivo:    { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto:    { fontSize: 13, color: cores.texto },
  chipTextoAtivo:{ color: '#fff', fontWeight: '600' },
  card:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  medalha:      { fontSize: 28, marginRight: 12, width: 36, textAlign: 'center' },
  cardInfo:     { flex: 1 },
  cardNome:     { fontWeight: '600', fontSize: 15, color: cores.texto },
  cardRegiao:   { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },
  notaBox:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nota:         { fontSize: 16, fontWeight: 'bold' },
  statsCard:    { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statsRegiao:  { fontSize: 16, fontWeight: '700', color: cores.texto, marginBottom: 12 },
  statsGrade:   { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: cores.borda + '40', paddingBottom: 12 },
  statItem:     { alignItems: 'center' },
  statValor:    { fontSize: 22, fontWeight: 'bold', color: cores.texto },
  statLabel:    { fontSize: 11, color: cores.textoSecundario, marginTop: 2 },
  criteriosGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  criterioStat: { backgroundColor: cores.primaria + '12', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', minWidth: 70 },
  criterioStatVal: { fontSize: 16, fontWeight: 'bold', color: cores.primaria },
  criterioStatLabel: { fontSize: 10, color: cores.textoSecundario, marginTop: 2 },
  vazio:        { alignItems: 'center', paddingTop: 60 },
  vazioTexto:   { color: cores.textoSecundario, marginTop: 12 },
});

export default TelaRanking;
