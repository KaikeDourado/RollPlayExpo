import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../lib/auth';
import { fetchSecure } from '../lib/fetchSecure';

// Componentes de Modal
const SessionModal = ({ visible, onClose, onCampaignCreated }) => {
  const [campaignName, setCampaignName] = React.useState('');
  const [campaignDescription, setCampaignDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (!campaignName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a campanha.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const campaignData = {
        userUid: currentUser.uid,
        name: campaignName.trim(),
        description: campaignDescription.trim() || '',       
      };

      console.log('Criando campanha:', campaignData);

      const response = await fetchSecure(
        'https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaignData)
        }
      );

      if (response.ok) {
        const newCampaign = await response.json();
        console.log('Campanha criada com sucesso:', newCampaign);
        
        Alert.alert('Sucesso', 'Campanha criada com sucesso!');
        setCampaignName('');
        setCampaignDescription('');
        onClose();
        
        // Notifica o componente pai para atualizar a lista
        if (onCampaignCreated) {
          onCampaignCreated(newCampaign);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro ao criar campanha:', response.status, errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível criar a campanha.');
      }
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      Alert.alert('Erro', 'Não foi possível criar a campanha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>🎲 Criar Nova Campanha</Text>
          
          <Text style={modalStyles.label}>Nome da Campanha</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: A Maldição de Strahd"
            placeholderTextColor="#6b7280"
            value={campaignName}
            onChangeText={setCampaignName}
            maxLength={50}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descreva sua campanha..."
            placeholderTextColor="#6b7280"
            value={campaignDescription}
            onChangeText={setCampaignDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
            editable={!loading}
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleCreate} 
              style={[modalStyles.createButton, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={modalStyles.createButtonText}>Criar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onClose} 
              style={modalStyles.cancelButton}
              disabled={loading}
            >
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const EnterSessionModal = ({ visible, onClose, onSessionJoined }) => {
  const [sessionCode, setSessionCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleJoin = async () => {
    if (!sessionCode.trim()) {
      Alert.alert('Erro', 'Por favor, insira o código da sessão.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Tentando entrar na sessão com código:', sessionCode.trim());

      // Primeiro, buscar a campanha pelo código
      const searchResponse = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${sessionCode.trim()}`,
        { method: 'GET' }
      );

      if (!searchResponse.ok) {
        if (searchResponse.status === 404) {
          Alert.alert('Erro', 'Código de sessão inválido. Verifique e tente novamente.');
        } else {
          Alert.alert('Erro', 'Não foi possível encontrar a sessão.');
        }
        setLoading(false);
        return;
      }

      const campaignData = await searchResponse.json();
      console.log('Campanha encontrada:', campaignData);

      const campaignId = campaignData.id || campaignData._id;

      // Verificar se o usuário já está na campanha
      if (campaignData.players && campaignData.players.includes(currentUser.uid)) {
        Alert.alert('Aviso', 'Você já está participando desta campanha!');
        setSessionCode('');
        onClose();
        if (onSessionJoined) {
          onSessionJoined(campaignData);
        }
        return;
      }

      // Adicionar o jogador à campanha
      const joinResponse = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/user/enter`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authApi.getIdToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            campaignUid: campaignId
          })
        }
      );

      if (joinResponse.ok) {
        const updatedCampaign = await joinResponse.json();
        console.log('Entrou na campanha com sucesso:', updatedCampaign);
        
        Alert.alert(
          'Sucesso!', 
          `Você entrou na campanha "${campaignData.name || 'sem nome'}"!`,
          [{ text: 'OK' }]
        );
        
        setSessionCode('');
        onClose();
        
        // Notifica o componente pai para atualizar a lista
        if (onSessionJoined) {
          onSessionJoined(updatedCampaign);
        }
      } else {
        const errorData = await joinResponse.json().catch(() => ({}));
        console.error('Erro ao entrar na campanha:', joinResponse.status, errorData);
        Alert.alert('Erro', errorData.message || 'Não foi possível entrar na campanha.');
      }
    } catch (err) {
      console.error('Erro ao entrar na sessão:', err);
      Alert.alert('Erro', 'Não foi possível entrar na sessão. Verifique o código e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>🚪 Entrar em Sessão</Text>
          <Text style={modalStyles.modalSubtitle}>
            Digite o código da sessão para participar
          </Text>
          
          <Text style={modalStyles.label}>Código da Sessão</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: ABC123"
            placeholderTextColor="#6b7280"
            value={sessionCode}
            onChangeText={setSessionCode}
            autoCapitalize="characters"
            maxLength={13}
            editable={!loading}
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleJoin} 
              style={[modalStyles.createButton, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={modalStyles.createButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onClose} 
              style={modalStyles.cancelButton}
              disabled={loading}
            >
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isEnterSessionModalOpen, setIsEnterSessionModalOpen] = useState(false);

  const navigation = useNavigation();

  // Função para recarregar campanhas
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const userId = currentUser.uid;
      console.log('Buscando campanhas para o usuário:', userId);

      const response = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/user/${userId}`,
        { method: 'GET' }
      );

      console.log('Status da resposta de campanhas:', response.status);

      if (response.ok) {
        const campaignsData = await response.json();
        console.log('Campanhas carregadas com sucesso:', campaignsData);

        if (Array.isArray(campaignsData) && campaignsData.length > 0) {
          setCampaigns(campaignsData);
        } else if (campaignsData && campaignsData.campaigns && Array.isArray(campaignsData.campaigns)) {
          setCampaigns(campaignsData.campaigns);
        } else {
          console.warn('Resposta de campanhas vazia');
          setCampaigns([]);
        }
      } else {
        console.warn('Erro ao carregar campanhas - Status:', response.status);
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Erro ao buscar campanhas:', err.message);
      setError('Não foi possível carregar as campanhas.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler para quando uma campanha é criada
  const handleCampaignCreated = (newCampaign) => {
    console.log('Nova campanha criada, recarregando lista...');
    fetchCampaigns();
  };

  // Handler para quando o usuário entra em uma sessão
  const handleSessionJoined = (campaign) => {
    console.log('Entrou em uma nova sessão, recarregando lista...');
    fetchCampaigns();
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando campanhas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚔️ Minhas Campanhas</Text>
        <Text style={styles.headerSubtitle}>
          {campaigns.length} {campaigns.length === 1 ? 'campanha' : 'campanhas'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsSessionModalOpen(true)}
        >
          <Text style={styles.createButtonIcon}>+</Text>
          <Text style={styles.createButtonText}>Criar Campanha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.enterSessionButton}
          onPress={() => setIsEnterSessionModalOpen(true)}
        >
          <Text style={styles.enterSessionButtonIcon}>🚪</Text>
          <Text style={styles.enterSessionButtonText}>Entrar em Sessão</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Campaigns List */}
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {campaigns.length > 0 ? (
          <View style={styles.campaignsList}>
            {campaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id || campaign._id}
                style={styles.campaignCard}
                onPress={() => {
                  console.log('Navegando para campanha:', campaign);
                  navigation.navigate('ProfileSession', {
                    campaignUid: campaign.id || campaign._id,
                    campaignData: campaign
                  });
                }}
                activeOpacity={0.7}
              >
                {/* Campaign Icon */}
                <View style={styles.campaignIcon}>
                  <Text style={styles.campaignIconText}>🎲</Text>
                </View>

                {/* Campaign Info */}
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignName}>
                    {campaign.name || campaign.title}
                  </Text>
                  {campaign.description && (
                    <Text style={styles.campaignDescription}>
                      {campaign.description.substring(0, 60)}
                      {campaign.description.length > 60 ? '...' : ''}
                    </Text>
                  )}
                  <View style={styles.campaignMeta}>
                    <View style={styles.campaignTag}>
                      <Text style={styles.campaignTagText}>
                        {campaign.system || 'D&D 5e'}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📜</Text>
            <Text style={styles.emptyStateTitle}>Nenhuma campanha ainda</Text>
            <Text style={styles.emptyStateText}>
              Crie uma nova campanha ou entre em uma sessão existente para começar sua aventura!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <SessionModal 
        visible={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)}
        onCampaignCreated={handleCampaignCreated}
      />
      <EnterSessionModal 
        visible={isEnterSessionModalOpen} 
        onClose={() => setIsEnterSessionModalOpen(false)}
        onSessionJoined={handleSessionJoined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Header
  header: {
    backgroundColor: '#1a1f3a',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '500',
  },

  // Action Buttons
  actionSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  createButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  enterSessionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1f3a',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#2d3653',
    gap: 8,
  },
  enterSessionButtonIcon: {
    fontSize: 18,
  },
  enterSessionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  // Error
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#2d1f1f',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Scroll Content
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Campaigns List
  campaignsList: {
    gap: 12,
  },
  campaignCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
  },
  campaignIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  campaignIconText: {
    fontSize: 28,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  campaignDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 8,
  },
  campaignMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  campaignTag: {
    backgroundColor: '#0a0e27',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  campaignTagText: {
    fontSize: 12,
    color: '#3b9dff',
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#1a1f3a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0a0e27',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2d3653',
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: 16,
  },
});