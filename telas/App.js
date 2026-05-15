import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export default function App() {

  // Estados
  const [tipoLocal, setTipoLocal] = useState("Praça");
  const [bairro, setBairro] = useState("Centro");
  const [nota, setNota] = useState("3+");
  const [criterio, setCriterio] = useState([]);

  // Seleção múltipla
  const toggleCriterio = (item) => {
    if (criterio.includes(item)) {
      setCriterio(criterio.filter((c) => c !== item));
    } else {
      setCriterio([...criterio, item]);
    }
  };

  // Botão reutilizável
  const renderButton = (
    title,
    selected,
    onPress
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selected && styles.activeButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterText,
          selected && styles.activeButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />

        <Text style={styles.headerTitle}>
          Buscar Locais
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
          />

          <TextInput
            placeholder="Ex: Praça da Sé..."
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        {/* Tipo */}
        <Text style={styles.sectionTitle}>
          Filtrar por:
        </Text>

        <Text style={styles.label}>
          Tipo de Local
        </Text>

        <View style={styles.row}>

          {renderButton(
            "Rua",
            tipoLocal === "Rua",
            () => setTipoLocal("Rua")
          )}

          {renderButton(
            "Prédio",
            tipoLocal === "Prédio",
            () => setTipoLocal("Prédio")
          )}

          {renderButton(
            "Estabelecimento",
            tipoLocal === "Estabelecimento",
            () => setTipoLocal("Estabelecimento")
          )}

          {renderButton(
            "Praça",
            tipoLocal === "Praça",
            () => setTipoLocal("Praça")
          )}

        </View>

        {/* Bairro */}
        <Text style={styles.label}>
          Bairro / Região
        </Text>

        <View style={styles.row}>

          {renderButton(
            "Centro",
            bairro === "Centro",
            () => setBairro("Centro")
          )}

          {renderButton(
            "Zona Sul",
            bairro === "Zona Sul",
            () => setBairro("Zona Sul")
          )}

          {renderButton(
            "Zona Norte",
            bairro === "Zona Norte",
            () => setBairro("Zona Norte")
          )}

          {renderButton(
            "Zona Leste",
            bairro === "Zona Leste",
            () => setBairro("Zona Leste")
          )}

        </View>

        {/* Nota */}
        <Text style={styles.label}>
          Nota Mínima
        </Text>

        <View style={styles.row}>

          {renderButton(
            "1+",
            nota === "1+",
            () => setNota("1+")
          )}

          {renderButton(
            "2+",
            nota === "2+",
            () => setNota("2+")
          )}

          {renderButton(
            "3+",
            nota === "3+",
            () => setNota("3+")
          )}

          {renderButton(
            "4+",
            nota === "4+",
            () => setNota("4+")
          )}

        </View>

        {/* Critérios */}
        <Text style={styles.label}>
          Critério
        </Text>

        <View style={styles.row}>

          {renderButton(
            "Rampa",
            criterio.includes("Rampa"),
            () => toggleCriterio("Rampa")
          )}

          {renderButton(
            "Calçada",
            criterio.includes("Calçada"),
            () => toggleCriterio("Calçada")
          )}

          {renderButton(
            "Sinalização",
            criterio.includes("Sinalização"),
            () => toggleCriterio("Sinalização")
          )}

          {renderButton(
            "Elevador",
            criterio.includes("Elevador"),
            () => toggleCriterio("Elevador")
          )}

        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>
            APLICAR FILTROS
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Menu Inferior */}
      <View style={styles.bottomNav}>

        <View style={styles.navItem}>
          <Ionicons
            name="home-outline"
            size={22}
            color="#999"
          />
          <Text style={styles.navText}>
            Início
          </Text>
        </View>

        <View style={styles.navItem}>
          <Ionicons
            name="map"
            size={22}
            color="#1F9D55"
          />
          <Text
            style={[
              styles.navText,
              { color: "#1F9D55" },
            ]}
          >
            Mapa
          </Text>
        </View>

        <View style={styles.navItem}>
          <Ionicons
            name="add-circle-outline"
            size={22}
            color="#999"
          />
          <Text style={styles.navText}>
            Avaliar
          </Text>
        </View>

        <View style={styles.navItem}>
          <Ionicons
            name="trophy-outline"
            size={22}
            color="#999"
          />
          <Text style={styles.navText}>
            Ranking
          </Text>
        </View>

        <View style={styles.navItem}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#999"
          />
          <Text style={styles.navText}>
            Perfil
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}