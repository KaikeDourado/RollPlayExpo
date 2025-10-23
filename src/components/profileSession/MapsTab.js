
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
// Para ícones, você pode usar @expo/vector-icons, por exemplo:
// import { Feather } from '@expo/vector-icons'; // Para o ícone de edição

/**
 * @function MapsTab
 * @description Componente de aba para exibir e gerenciar mapas de campanha no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile. A lógica de backend para buscar e adicionar mapas é removida.
 */
const MapsTab = () => {
  // Dados de exemplo dos mapas
  const maps = [
    {
      id: 1,
      title: 'Mapa da Cidade',
      description: 'Mapa detalhado da cidade principal da campanha',
      imageUrl: require("../../../assets/cidade.jpg"), // Caminho ajustado para assets
    },
    // Adicione mais mapas conforme necessário
  ];

  const handleAddMap = () => {
    Alert.alert('Novo Mapa', 'Funcionalidade de adicionar novo mapa a ser implementada com o backend.');
  };

  const handleEditMap = (mapTitle) => {
    Alert.alert('Editar Mapa', `Funcionalidade de editar o mapa: ${mapTitle} a ser implementada.`);
  };

  const handleViewMap = (mapTitle) => {
    Alert.alert('Ver Mapa', `Navegar para a visualização do mapa: ${mapTitle}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MAPAS</Text>
        <TouchableOpacity style={styles.addMapButton} onPress={handleAddMap}>
          <Text style={styles.addMapButtonText}>+ NOVO MAPA</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.mapsGrid}>
        {maps.map(map => (
          <View key={map.id} style={styles.mapCard}>
            <View style={styles.mapImageContainer}>
              <Image source={map.imageUrl} style={styles.mapThumbnail} />
              <TouchableOpacity style={styles.editMapButton} onPress={() => handleEditMap(map.title)}>
                {/* <Feather name="edit" size={20} color="#fff" /> */}
                <Text style={styles.editMapButtonText}>✎ Editar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapInfo}>
              <Text style={styles.mapTitle}>{map.title}</Text>
              <Text style={styles.mapDescription}>{map.description}</Text>
            </View>
            <View style={styles.mapActions}>
              <TouchableOpacity style={styles.viewMapButton} onPress={() => handleViewMap(map.title)}>
                <Text style={styles.viewMapButtonText}>Ver Mapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addMapButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addMapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mapsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mapCard: {
    width: '48%', // Ajuste para duas colunas
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mapImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  mapThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editMapButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editMapButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  mapInfo: {
    padding: 10,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mapDescription: {
    fontSize: 12,
    color: '#666',
  },
  mapActions: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewMapButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewMapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MapsTab;

