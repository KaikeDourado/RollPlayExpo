import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import PlayersTab from '../components/profileSession/PlayersTab';
import SessionsTab from '../components/profileSession/SessionsTab';
import NotesTab from '../components/profileSession/NotesTab';
import MapsTab from '../components/profileSession/MapsTab';
import NPCsTab from '../components/profileSession/NPCsTab';
import GeneralTab from '../components/profileSession/GeneralTab';
import ChatTab from '../components/profileSession/ChatTab';
import CustomDrawer from '../components/profileSession/CustomDrawer';
import CharacterSelectModal from '../components/profileSession/CharacterSelectModal';
import { fetchSecure } from '../lib/fetchSecure';

const screenHeight = Dimensions.get('window').height;

export default function ProfileSessionPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { campaignUid, campaignData } = route.params;

  const [sessionData, setSessionData] = useState(campaignData || null);
  const [loading, setLoading] = useState(!campaignData);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('GERAL');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isCharacterSelectVisible, setIsCharacterSelectVisible] = useState(false);

  // controle do botão de ficha
  const sheetPosition = useRef(new Animated.Value(screenHeight)).current;

  const openCharacterModal = () => {
    setIsCharacterSelectVisible(true);
    Animated.timing(sheetPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeCharacterModal = () => {
    Animated.timing(sheetPosition, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: false,
    }).start(() => setIsCharacterSelectVisible(false));
  };

  const modalPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          sheetPosition.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          closeCharacterModal();
        } else {
          Animated.spring(sheetPosition, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    const fetchSession = async () => {
      // Se os dados já foram passados, não precisa fazer requisição
      if (campaignData) {
        setLoading(false);
        return;
      }

      // Se não tem dados, tenta buscar da API
      try {
        console.log('Buscando dados da campanha:', campaignUid);
        
        const response = await fetchSecure(
          `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
          { method: 'GET' }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Dados da campanha recebidos:', data);
          setSessionData(data);
        } else {
          setError('Erro ao carregar dados da campanha');
          // Dados padrão como fallback
          setSessionData({
            uid: campaignUid,
            name: `Campanha ${campaignUid}`,
            description: 'Campanha sem informações carregadas',
          });
        }
      } catch (err) {
        console.error('Erro ao buscar campanha:', err.message);
        setError(err.message);
        // Dados padrão como fallback
        setSessionData({
          uid: campaignUid,
          name: `Campanha ${campaignUid}`,
          description: 'Erro ao carregar dados',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [campaignUid, campaignData]);



  // Função para obter o título da tab ativa
  const getActiveTabTitle = () => {
    const tabTitles = {
      'GERAL': '📊 Geral',
      'JOGADORES': '⚔️ Jogadores',
      'SESSÕES': '📖 Sessões',
      'NOTAS': '📝 Notas',
      'MAPAS': '🗺️ Mapas',
      'NPCS': '🧙 NPCs',
    };
    return tabTitles[activeTab] || 'Campanha';
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando sessão...</Text>
      </View>
    );

  if (error && !sessionData) 
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Erro ao carregar</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  if (!sessionData) 
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>🔍</Text>
        <Text style={styles.errorTitle}>Sessão não encontrada</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  const renderContent = () => {
    switch (activeTab) {
      case 'GERAL':
        return <GeneralTab campaignData={sessionData} campaignUid={campaignUid} />;
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
        return <GeneralTab campaignData={sessionData} campaignUid={campaignUid} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setIsDrawerVisible(true)} 
          style={styles.menuButton}
        >
          <View style={styles.menuIconContainer}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{getActiveTabTitle()}</Text>
          <Text style={styles.headerSubtitle}>{sessionData?.name}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.exitButton}
        >
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>

      {/* Botão de Ficha */}
      <View style={styles.fichaButtonContainer}>
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.fichaButton} 
          onPress={isCharacterSelectVisible ? closeCharacterModal : openCharacterModal}
        >
          <Text style={styles.fichaText}>
            {isCharacterSelectVisible ? '▼ FECHAR' : '▲ FICHA'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Drawer lateral */}
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        campaignData={sessionData}
      />

      {/* Botão de Chat */}
      <TouchableOpacity 
        style={styles.chatButton} 
        onPress={() => setIsChatVisible(true)}
      >
        <Text style={styles.chatButtonIcon}>💬</Text>
      </TouchableOpacity>

      {/* Modal Chat */}
      <Modal 
        visible={isChatVisible} 
        animationType="slide" 
        transparent 
        onRequestClose={() => setIsChatVisible(false)}
      >
        <View style={styles.chatModalContainer}>
          <View style={styles.chatModalHeader}>
            <Text style={styles.chatModalTitle}>💬 Chat da Sessão</Text>
            <TouchableOpacity 
              onPress={() => setIsChatVisible(false)}
              style={styles.chatCloseButton}
            >
              <Text style={styles.chatCloseButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ChatTab campaignUid={campaignUid} />
        </View>
      </Modal>

      {/* Character Select Modal */}
      {isCharacterSelectVisible && (
        <Animated.View
          style={[
            styles.characterSheet,
            { 
              transform: [{ translateY: sheetPosition }],
              height: '100%',
            }
          ]}
          {...modalPanResponder.panHandlers}
        >
          <CharacterSelectModal
            onClose={closeCharacterModal}
            campaignUid={campaignUid}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0e27' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0a0e27'
  },
  loadingText: { 
    color: '#9ca3af', 
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500'
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: { 
    color: '#ef4444', 
    textAlign: 'center', 
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#1a1f3a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  menuIconContainer: {
    gap: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: '#3b9dff',
    borderRadius: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '800',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  exitButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  exitText: { 
    color: '#ef4444', 
    fontSize: 20, 
    fontWeight: '700'
  },
  contentWrapper: {
    flex: 1,
    paddingBottom: 80, // Espaço para o botão de ficha
  },

  fichaButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 50, // Reduzido para não sobrepor outros modais importantes
  },
  fichaButton: {
    width: '100%',
    backgroundColor: '#1a1f3a',
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#3b9dff',
    shadowColor: '#3b9dff',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  characterSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#131525',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 998,
  },
  fichaText: { 
    color: '#fff', 
    fontWeight: '800', 
    fontSize: 16, 
    letterSpacing: 1 
  },

  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 110, // Ajustado para ficar acima do botão de ficha
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b9dff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#3b9dff',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: '#0a0e27',
    zIndex: 100, // Garante que fica acima de outros elementos
  },
  chatButtonIcon: { 
    fontSize: 28,
  },

  chatModalContainer: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    marginTop: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  chatModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  chatModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  chatCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  chatCloseButtonText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
  },
});