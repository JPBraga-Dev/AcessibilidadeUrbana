const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const backendDir = path.resolve(__dirname, 'backend');

// Escapa todos os caracteres especiais de regex no caminho (ex: . em @gmail.com)
const escapedPath = backendDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Impede o Metro de ler package.json do backend e de incluir qualquer
// arquivo da pasta backend/ no bundle do app React Native
config.resolver.blockList = [
  new RegExp(`^${escapedPath}(/.*)?$`),
];

module.exports = config;
