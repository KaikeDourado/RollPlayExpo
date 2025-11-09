
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

/**
 * @function SessionsTab
 * @description Componente de aba para exibir as sessões de uma campanha no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile. A lógica de backend para buscar sessões é removida.
 */
const SessionsTab = () => {
  // Dados de exemplo das sessões
  const sessions = [
    { id: 1, title: 'Sessão 1: O Início da Jornada', date: '10/09/2023', duration: '4h' },
    { id: 2, title: 'Sessão 2: Encontro com o Dragão', date: '17/09/2023', duration: '5h' },
    { id: 3, title: 'Sessão 3: A Caverna Misteriosa', date: '24/09/2023', duration: '3h' },
  ];

  const handleNewSession = () => {
    Alert.alert('Nova Sessão', 'Funcionalidade de criar nova sessão a ser implementada com o backend.');
  };

  const handleViewDetails = (sessionTitle) => {
    Alert.alert('Ver Detalhes', `Navegar para os detalhes da sessão: ${sessionTitle}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SESSÕES</Text>
        <TouchableOpacity style={styles.newSessionButton} onPress={handleNewSession}>
          <Text style={styles.newSessionButtonText}>+ NOVA SESSÃO</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.sessionsList}>
        {sessions.map(session => (
          <View key={session.id} style={styles.sessionItem}>
            <View style={styles.sessionInfoContainer}>
              <Text style={styles.sessionItemTitle}>{session.title}</Text>
              <View style={styles.sessionItemDetails}>
                <Text style={styles.sessionDate}>Data: {session.date}</Text>
                <Text style={styles.sessionDuration}>Duração: {session.duration}</Text>
              </View>
            </View>
            <View style={styles.sessionActions}>
              <TouchableOpacity style={styles.viewSessionButton} onPress={() => handleViewDetails(session.title)}>
                <Text style={styles.viewSessionButtonText}>Ver Detalhes</Text>
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
    color: '#fff',
  },
  newSessionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  newSessionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sessionInfoContainer: {
    flex: 1,
    marginRight: 10,
  },
  sessionItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sessionItemDetails: {
    flexDirection: 'row',
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  sessionDuration: {
    fontSize: 12,
    color: '#666',
  },
  sessionActions: {
    // Estilos para os botões de ação, se houver mais de um
  },
  viewSessionButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewSessionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SessionsTab;

