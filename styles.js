import { StyleSheet } from 'react-native';

export const cores = {
  primaria: '#22A065',
  primariaEscura: '#1F8B57',
  texto: '#1A1A1A',
  textoSecundario: '#6B7280',
  borda: '#D1D5DB',
  fundo: '#FFFFFF',
  fundoCard: '#E8F5EE',
  erro: '#DC2626',
};

const styles = StyleSheet.create({
  // Layout base
  container_padrao: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  container_centralizado: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  // Header com botão voltar
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    height: 32,
  },
  header_titulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
    textAlign: 'center',
    marginRight: 32,
  },
  botao_voltar: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo
  logo_circulo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  logo_titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.primaria,
    textAlign: 'center',
    marginBottom: 40,
  },

  // Inputs
  campo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: cores.texto,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: cores.texto,
    backgroundColor: cores.fundo,
  },

  // Link "esqueci senha"
  link_direita: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  link_texto: {
    color: cores.primaria,
    fontSize: 13,
    fontWeight: '600',
  },

  // Botão primário
  botao_primario: {
    backgroundColor: cores.primaria,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  botao_primario_desabilitado: {
    opacity: 0.6,
  },
  botao_primario_texto: {
    color: cores.fundo,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Link inferior "Não tem conta?"
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  rodape_texto: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  rodape_link: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // Checkbox de termos
  termos_linha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: cores.borda,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox_marcado: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  termos_texto: {
    flex: 1,
    fontSize: 13,
    color: cores.texto,
  },
  termos_link: {
    color: cores.primaria,
    fontWeight: '600',
  },

  // Recuperar senha — card de info
  info_card: {
    flexDirection: 'row',
    backgroundColor: cores.fundoCard,
    borderRadius: 8,
    padding: 14,
    marginTop: 24,
    alignItems: 'flex-start',
  },
  info_card_texto: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: cores.texto,
    lineHeight: 18,
  },

  // Recuperar senha — ícone central + título
  icone_grande: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  titulo_secao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: cores.texto,
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: cores.textoSecundario,
    marginBottom: 24,
    lineHeight: 20,
  },
});

export default styles;
