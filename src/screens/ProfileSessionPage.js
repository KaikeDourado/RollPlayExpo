
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Importar os componentes das abas (serão criados posteriormente)
import PlayersTab from '../components/profileSession/PlayersTab';
import SessionsTab from '../components/profileSession/SessionsTab';
import NotesTab from '../components/profileSession/NotesTab';
import MapsTab from '../components/profileSession/MapsTab';
import NPCsTab from '../components/profileSession/NPCsTab';
import ChatTab from '../components/profileSession/ChatTab';

// Componente SessionInfo (placeholder ou adaptado)
const SessionInfo = ({ sessionData, onUpdateSessionData }) => (
  <View style={sessionInfoStyles.container}>
    <Text style={sessionInfoStyles.title}>{sessionData?.name || 'Nome da Campanha'}</Text>
    <Text style={sessionInfoStyles.description}>{sessionData?.description || 'Descrição da campanha.'}</Text>
    {/* Adicionar mais detalhes da sessão aqui */}
  </View>
);

// Componente TabNavigation (adaptado)
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['CHAT', 'JOGADORES', 'SESSÕES', 'NOTAS', 'MAPAS', 'NPCS'];
  return (
    <View style={tabNavigationStyles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[tabNavigationStyles.tabItem, activeTab === tab && tabNavigationStyles.activeTabItem]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[tabNavigationStyles.tabText, activeTab === tab && tabNavigationStyles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * @function ProfileSessionPage
 * @description Tela de detalhes da sessão de RPG no aplicativo React Native.
 * Adaptada do projeto React original, convertendo elementos HTML para componentes React Native,
 * removendo a lógica de backend (axios, localStorage/sessionStorage) e utilizando React Navigation
 * para obter parâmetros de rota e navegar.
 * As abas (PlayersTab, ChatTab, etc.) são placeholders e precisarão ser migradas individualmente.
 */
export default function ProfileSessionPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { campaignUid } = route.params; // Obtém o campaignUid dos parâmetros da rota

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('CHAT');

  useEffect(() => {
    const fetchSession = async () => {
      // Simulação de busca de dados da sessão
      // Em um cenário real, você faria uma chamada de API aqui usando o campaignUid
      setTimeout(() => {
        if (campaignUid) {
          setSessionData({
            uid: campaignUid,
            name: `Campanha de Teste ${campaignUid}`,
            description: `Esta é a descrição da campanha ${campaignUid}.`,
            // Outros dados da sessão
          });
          setLoading(false);
        } else {
          setError('ID da campanha não fornecido.');
          setLoading(false);
        }
      }, 1000);
    };

    fetchSession();
  }, [campaignUid]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando sessão...</Text>
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!sessionData) {
    return <Text style={styles.errorText}>Sessão não encontrada.</Text>;
  }

  const handleUpdateSessionData = (newData) => {
    setSessionData((prev) => ({ ...prev, ...newData }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CHAT':
        return <ChatTab campaignUid={campaignUid} />;
      case 'JOGADORES':
        return <PlayersTab campaignUid={campaignUid} />;
      case 'SESSÕES':
        return <SessionsTab campaignUid={campaignUid} />;
      case 'NOTAS':
        return <NotesTab campaignUid={campaignUid} />;
      case 'MAPAS':
        return <MapsTab campaignUid={campaignUid} />;
      case 'NPCS':
        return <NPCsTab campaignUid={campaignUid} />;
      default:
        return <PlayersTab campaignUid={campaignUid} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.sidebar}>
          <SessionInfo
            sessionData={sessionData}
            onUpdateSessionData={handleUpdateSessionData}
          />
        </View>

        <View style={styles.mainContent}>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  contentContainer: {
    flexGrow: 1,
  },
  sidebar: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mainContent: {
    flex: 1,
    padding: 10,
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

const sessionInfoStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

const tabNavigationStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#3b82f6',
  },
});

