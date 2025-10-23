
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';

/**
 * @function NPCsTab
 * @description Componente de aba para exibir e gerenciar NPCs de campanha no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile. A lógica de backend para buscar e adicionar NPCs é removida.
 */
const NPCsTab = () => {
  // Dados de exemplo dos NPCs
  const npcs = [
    {
      id: 1,
      name: 'Grommash',
      role: 'Ferreiro',
      description: 'Um anão ferreiro especializado em armas lendárias',
      avatar: require("../../../assets/ferreiro.jpg"), // Caminho ajustado para assets
    },
    {
      id: 2,
      name: 'Ladybug',
      role: 'Maga',
      description: 'Uma maga poderosa com segredos sombrios.',
      avatar: require("../../../assets/ladybug.jpg"), // Caminho ajustado para assets
    },
  ];

  const handleAddNpc = () => {
    Alert.alert('Novo NPC', 'Funcionalidade de adicionar novo NPC a ser implementada com o backend.');
  };

  const handleViewDetails = (npcName) => {
    Alert.alert('Ver Detalhes', `Navegar para os detalhes do NPC: ${npcName}`);
  };

  const handleEditNpc = (npcName) => {
    Alert.alert('Editar NPC', `Funcionalidade de editar o NPC: ${npcName} a ser implementada.`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NPCS</Text>
        <TouchableOpacity style={styles.addNpcButton} onPress={handleAddNpc}>
          <Text style={styles.addNpcButtonText}>+ NOVO NPC</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.npcsGrid}>
        {npcs.map(npc => (
          <View key={npc.id} style={styles.npcCard}>
            <View style={styles.npcAvatarContainer}>
              <Image source={npc.avatar} style={styles.npcAvatar} />
            </View>
            <View style={styles.npcInfo}>
              <Text style={styles.npcName}>{npc.name}</Text>
              <Text style={styles.npcRole}>{npc.role}</Text>
              <Text style={styles.npcDescription}>{npc.description}</Text>
            </View>
            <View style={styles.npcActions}>
              <TouchableOpacity style={styles.viewNpcButton} onPress={() => handleViewDetails(npc.name)}>
                <Text style={styles.buttonText}>Ver Detalhes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editNpcButton} onPress={() => handleEditNpc(npc.name)}>
                <Text style={styles.buttonText}>Editar</Text>
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
  addNpcButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addNpcButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  npcsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  npcCard: {
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
  npcAvatarContainer: {
    alignItems: 'center',
    paddingTop: 15,
  },
  npcAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  npcInfo: {
    padding: 10,
    alignItems: 'center',
  },
  npcName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  npcRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  npcDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  npcActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  viewNpcButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editNpcButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NPCsTab;

