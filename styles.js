import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh', 
  },

  header: {
    backgroundColor: '#1976d2', 
    padding: 16,
  },

  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  mapContainer: {
    flex: 1,
  },

  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },

  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },

  filterBtn: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 20,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },

  footerText: {
    fontSize: 12,
  },
});