import { useEffect, useState, useCallback } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, TextInput, Modal, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { cores } from '../styles';
import { authApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

// ──────────────────────────────────────────────
// Avatar com inicial do nome
// ──────────────────────────────────────────────
function Avatar({ nome, tamanho = 80 }) {
  const letra = (nome ?? '?').charAt(0).toUpperCase();
  return (
    <View style={[s.avatar, { width: tamanho, height: tamanho, borderRadius: tamanho / 2 }]}>
      <Text style={[s.avatarLetra, { fontSize: tamanho * 0.42 }]}>{letra}</Text>
    </View>
  );
}

// ──────────────────────────────────────────────
// Item de menu
// ──────────────────────────────────────────────
function MenuItem({ icone, label, descricao, onPress, cor, ultimo }) {
  const corIcone = cor ?? cores.texto;
  return (
    <TouchableOpacity
      style={[s.menuItem, ultimo && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[s.menuIconeBox, { backgroundColor: corIcone + '15' }]}>
        <MaterialCommunityIcons name={icone} size={20} color={corIcone} />
      </View>
      <View style={s.menuTextos}>
        <Text style={[s.menuLabel, cor && { color: cor }]}>{label}</Text>
        {descricao ? <Text style={s.menuDesc}>{descricao}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={cores.textoSecundario} />
    </TouchableOpacity>
  );
}

// ──────────────────────────────────────────────
// Tela principal
// ──────────────────────────────────────────────
function TelaPerfil({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, entrar, sair, token } = useAuth();

  const [stats, setStats]         = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Modal editar nome
  const [modalNome, setModalNome]   = useState(false);
  const [novoNome, setNovoNome]     = useState('');
  const [salvando, setSalvando]     = useState(false);

  const buscarStats = useCallback(async () => {
    try {
      const dados = await authApi.stats();
      setStats(dados);
    } catch {
      setStats({ total_reviews: 0, total_places: 0 });
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { buscarStats(); }, [buscarStats]);

  const confirmarSair = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  };

  const abrirModalNome = () => {
    setNovoNome(user?.name ?? '');
    setModalNome(true);
  };

  const salvarNome = async () => {
    const nome = novoNome.trim();
    if (!nome) {
      Alert.alert('Atenção', 'O nome não pode ser vazio.');
      return;
    }
    setSalvando(true);
    try {
      await authApi.updateProfile({ name: nome });
      // Atualiza o usuário no contexto sem novo login
      await entrar(token, { ...user, name: nome });
      setModalNome(false);
      Alert.alert('Sucesso', 'Nome atualizado!');
    } catch (err) {
      Alert.alert('Erro', err.message);
    } finally {
      setSalvando(false);
    }
  };

  const nome  = user?.name ?? user?.email ?? 'Usuário';
  const email = user?.email ?? '';

  return (
    <View style={s.container}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Text style={s.headerTitulo}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Card do usuário */}
        <View style={s.perfilCard}>
          <Avatar nome={nome} tamanho={80} />
          <Text style={s.perfilNome}>{nome}</Text>
          <Text style={s.perfilEmail}>{email}</Text>
          {user?.role === 'admin' && (
            <View style={s.badgeAdmin}>
              <MaterialCommunityIcons name="shield-check" size={12} color="#fff" />
              <Text style={s.badgeAdminTexto}>Admin</Text>
            </View>
          )}
        </View>

        {/* Estatísticas */}
        <View style={s.statsCard}>
          <Text style={s.statsLabel}>Suas contribuições</Text>
          {carregando ? (
            <ActivityIndicator style={{ marginTop: 16 }} color={cores.primaria} />
          ) : (
            <View style={s.statsGrade}>
              <View style={s.statItem}>
                <Text style={s.statValor}>{stats?.total_reviews ?? 0}</Text>
                <MaterialCommunityIcons name="star-check-outline" size={18} color={cores.textoSecundario} style={{ marginTop: 4 }} />
                <Text style={s.statNome}>Avaliações</Text>
              </View>
              <View style={s.statDivisor} />
              <View style={s.statItem}>
                <Text style={s.statValor}>{stats?.total_places ?? 0}</Text>
                <MaterialCommunityIcons name="map-marker-plus-outline" size={18} color={cores.textoSecundario} style={{ marginTop: 4 }} />
                <Text style={s.statNome}>Locais</Text>
              </View>
              <View style={s.statDivisor} />
              <View style={s.statItem}>
                <Text style={[s.statValor, { color: cores.primaria }]}>
                  {(stats?.total_reviews ?? 0) + (stats?.total_places ?? 0)}
                </Text>
                <MaterialCommunityIcons name="trophy-outline" size={18} color={cores.primaria} style={{ marginTop: 4 }} />
                <Text style={s.statNome}>Total</Text>
              </View>
            </View>
          )}
        </View>

        {/* Seção Conta */}
        <View style={s.secaoCard}>
          <Text style={s.secaoTitulo}>Conta</Text>
          <MenuItem
            icone="account-edit-outline"
            label="Editar nome"
            descricao={nome}
            onPress={abrirModalNome}
          />
          <MenuItem
            icone="lock-reset"
            label="Alterar senha"
            descricao="Redefina sua senha de acesso"
            onPress={() => navigation.navigate('RecuperarSenha')}
          />
          <MenuItem
            icone="logout"
            label="Sair da conta"
            descricao="Encerrar sessão atual"
            onPress={confirmarSair}
            cor="#DC2626"
            ultimo
          />
        </View>

        {/* Sobre o app */}
        <View style={s.secaoCard}>
          <Text style={s.secaoTitulo}>Sobre</Text>
          <MenuItem
            icone="information-outline"
            label="Versão do app"
            descricao="1.0.0 — Projeto Acadêmico UNIFOR"
            onPress={() => {}}
            ultimo
          />
        </View>
      </ScrollView>

      {/* Modal editar nome */}
      <Modal
        visible={modalNome}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNome(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitulo}>Editar nome</Text>
            <TextInput
              style={s.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Seu nome completo"
              placeholderTextColor={cores.textoSecundario}
              autoFocus
            />
            <View style={s.modalBotoes}>
              <TouchableOpacity
                style={s.modalBotaoCancelar}
                onPress={() => setModalNome(false)}>
                <Text style={s.modalBotaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalBotaoSalvar, salvando && { opacity: 0.7 }]}
                onPress={salvarNome}
                disabled={salvando}>
                {salvando
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={s.modalBotaoSalvarTexto}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: '#F3F4F6' },

  // Header
  header:       { backgroundColor: cores.primariaEscura, paddingHorizontal: 20, paddingBottom: 14, alignItems: 'center' },
  headerTitulo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  // Card do usuário
  perfilCard:   { backgroundColor: '#fff', margin: 16, marginBottom: 12, borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  avatar:       { backgroundColor: cores.primaria, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarLetra:  { color: '#fff', fontWeight: 'bold' },
  perfilNome:   { fontSize: 20, fontWeight: 'bold', color: cores.texto, textAlign: 'center' },
  perfilEmail:  { fontSize: 13, color: cores.textoSecundario, marginTop: 4, textAlign: 'center' },
  badgeAdmin:   { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: cores.primaria, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  badgeAdminTexto: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Stats
  statsCard:    { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  statsLabel:   { fontSize: 13, fontWeight: '700', color: cores.textoSecundario, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  statsGrade:   { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem:     { alignItems: 'center', flex: 1 },
  statDivisor:  { width: 1, height: 50, backgroundColor: cores.borda },
  statValor:    { fontSize: 26, fontWeight: 'bold', color: cores.texto },
  statNome:     { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },

  // Seções de menu
  secaoCard:    { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  secaoTitulo:  { fontSize: 13, fontWeight: '700', color: cores.textoSecundario, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },

  // Itens de menu
  menuItem:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: cores.borda + '40', gap: 12 },
  menuIconeBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuTextos:   { flex: 1 },
  menuLabel:    { fontSize: 15, fontWeight: '600', color: cores.texto },
  menuDesc:     { fontSize: 12, color: cores.textoSecundario, marginTop: 1 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: '#00000060', justifyContent: 'center', alignItems: 'center', padding: 32 },
  modalBox:     { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%' },
  modalTitulo:  { fontSize: 18, fontWeight: 'bold', color: cores.texto, marginBottom: 16 },
  modalInput:   { borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: cores.texto, marginBottom: 20 },
  modalBotoes:  { flexDirection: 'row', gap: 12 },
  modalBotaoCancelar:      { flex: 1, borderWidth: 1, borderColor: cores.borda, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  modalBotaoCancelarTexto: { fontSize: 15, fontWeight: '600', color: cores.textoSecundario },
  modalBotaoSalvar:        { flex: 1, backgroundColor: cores.primaria, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  modalBotaoSalvarTexto:   { fontSize: 15, fontWeight: 'bold', color: '#fff' },
});

export default TelaPerfil;
