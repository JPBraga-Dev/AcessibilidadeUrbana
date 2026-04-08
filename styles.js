import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container_padrao: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conteiner_redes: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  texto_padrao: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  texto_link: {
    color: 'blue',
    textDecorationLine: 'underline',
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
  conteiner_texto_senha:{
    justifyContent: "end",
    marginBottom: 20
  },
    conteiner_botao:{
    marginBottom: 20,
    alignItems: 'center',
  }

});
export default styles;
