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
  const panY = useRef(new Animated.Value(0)).current;

  const fichaPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy < 0) panY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -80) {
          openCharacterModal();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // modal bottom sheet animation
  const sheetPosition = useRef(new Animated.Value(screenHeight)).current;
  const buttonPosition = useRef(new Animated.Value(0)).current;

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
          `https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
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

  const campaignCharacters = [
    { id: '1', name: 'Aragorn', class: 'Guerreiro', level: 5 },
    { id: '2', name: 'Gandalf', class: 'Mago', level: 8 },
    { id: '3', name: 'Legolas', class: 'Arqueiro', level: 6 },
  ];

  const handleCharacterSelect = (character) => {
    closeCharacterModal();
    navigation.navigate('Sheet', { id: character.id });
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando sessão...</Text>
      </View>
    );

  if (error && !sessionData) 
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );

  if (!sessionData) 
    return (
      <Text style={styles.errorText}>Sessão não encontrada.</Text>
    );

  const renderContent = () => {
    switch (activeTab) {
      case 'GERAL':
        return <GeneralTab campaignData={sessionData} />;
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
        return <GeneralTab campaignData={sessionData} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsDrawerVisible(true)} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sessionData?.name || 'Sessão'}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.exitText}>SAIR</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.tabContent}>{renderContent()}</View>
      </ScrollView>

      {/* Botão de Ficha */}
      <Animated.View
        style={[
          styles.fichaButtonContainer,
          {
            transform: [{ translateY: buttonPosition }],
            zIndex: 999,
          }
        ]}
      >
        <TouchableOpacity 
          activeOpacity={0.8} 
          style={styles.fichaButton} 
          onPress={isCharacterSelectVisible ? closeCharacterModal : openCharacterModal}
        >
          <Text style={styles.fichaText}>
            {isCharacterSelectVisible ? '▼ FECHAR' : '▲ FICHA'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Drawer lateral */}
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Botão de Chat */}
      <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatVisible(true)}>
        <Image source={require("../../assets/tres-pontos.png")} style={styles.chatButtonImage}></Image>
      </TouchableOpacity>

      {/* Modal Chat */}
      <Modal visible={isChatVisible} animationType="slide" transparent onRequestClose={() => setIsChatVisible(false)}>
        <View style={styles.chatModalContainer}>
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
            characters={campaignCharacters}
            onClose={closeCharacterModal}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1c' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10 },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#0a0f1c'
  },
  errorText: { color: '#ff6b6b', textAlign: 'center', padding: 20, fontSize: 16 },
  backButton: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#11182b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuButton: {
    padding: 5,
  },
  menuButtonText: { fontSize: 24, color: '#fff' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, marginLeft: 15 },
  exitText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  contentContainer: { flexGrow: 1, padding: 15, paddingBottom: 80 },
  tabContent: { backgroundColor: '#131b33', borderRadius: 10, padding: 15 },

  fichaButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  fichaButton: {
    width: '100%',
    backgroundColor: '#0d152b',
    paddingVertical: 14,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  characterSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 998,
  },
  fichaText: { color: '#fff', fontWeight: 'bold', fontSize: 17, letterSpacing: 1 },

  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  chatButtonImage: { width: 30, height: 30, tintColor: '#fff' },

  chatModalContainer: {
    flex: 1,
    backgroundColor: '#1b2540',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});