import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container_padrao: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  texto_padrao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },

  botao_padrao: {
    backgroundColor: '#3498DB',
    width: 250,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },

  input_contato: {
    height: 50,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },

  conteiner_botao: {
    marginBottom: 20,
    alignItems: 'center',
  },

  container_icone_voltar_contato: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    color: '#3498DB'
  },
});

export default styles;
