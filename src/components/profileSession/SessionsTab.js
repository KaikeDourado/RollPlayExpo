import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const SessionDetailModal = ({ visible, onClose, session }) => {
  if (!session) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          {/* Header */}
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>📖 Detalhes da Sessão</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeIconButton}>
              <Text style={modalStyles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={modalStyles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={modalStyles.detailSection}>
              <Text style={modalStyles.sessionTitleLarge}>{session.title}</Text>
            </View>

            <View style={modalStyles.infoGrid}>
              <View style={modalStyles.infoItem}>
                <View style={modalStyles.infoIconContainer}>
                  <Text style={modalStyles.infoIcon}>📅</Text>
                </View>
                <Text style={modalStyles.infoLabel}>Data</Text>
                <Text style={modalStyles.infoValue}>{session.date}</Text>
              </View>

              <View style={modalStyles.infoItem}>
                <View style={modalStyles.infoIconContainer}>
                  <Text style={modalStyles.infoIcon}>⏱️</Text>
                </View>
                <Text style={modalStyles.infoLabel}>Duração</Text>
                <Text style={modalStyles.infoValue}>{session.duration}</Text>
              </View>
            </View>

            {session.notes && (
              <View style={modalStyles.notesSection}>
                <View style={modalStyles.notesSectionHeader}>
                  <Text style={modalStyles.notesSectionIcon}>📝</Text>
                  <Text style={modalStyles.notesSectionTitle}>Notas da Sessão</Text>
                </View>
                <Text style={modalStyles.notesText}>{session.notes}</Text>
              </View>
            )}

            {session.highlights && session.highlights.length > 0 && (
              <View style={modalStyles.highlightsSection}>
                <View style={modalStyles.highlightsSectionHeader}>
                  <Text style={modalStyles.highlightsSectionIcon}>⭐</Text>
                  <Text style={modalStyles.highlightsSectionTitle}>Destaques</Text>
                </View>
                {session.highlights.map((highlight, index) => (
                  <View key={index} style={modalStyles.highlightItem}>
                    <Text style={modalStyles.highlightBullet}>•</Text>
                    <Text style={modalStyles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View style={modalStyles.modalFooter}>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AddSessionModal = ({ visible, onClose, onSessionAdded, campaignUid }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, insira um título para a sessão.');
      return;
    }

    setLoading(true);
    try {
      // Primeiro, buscar a campanha atual para obter o array de sessões
      const getCampaignResponse = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        { method: 'GET' }
      );

      if (!getCampaignResponse.ok) {
        throw new Error('Não foi possível buscar a campanha');
      }

      const campaignText = await getCampaignResponse.text();
      const campaignData = JSON.parse(campaignText);
      
      // Extrair os dados da campanha
      let campaign;
      if (campaignData.data) {
        campaign = campaignData.data;
      } else if (campaignData.campaign) {
        campaign = campaignData.campaign;
      } else {
        campaign = campaignData;
      }

      // Criar a nova sessão
      const newSession = {
        id: Date.now().toString(), // ID único baseado em timestamp
        title: title.trim(),
        date: date.trim() || new Date().toLocaleDateString('pt-BR'),
        duration: duration.trim() || '0h',
        notes: notes.trim(),
        createdAt: new Date().toISOString()
      };

      // Adicionar a nova sessão ao array existente
      const updatedSessoes = [...(campaign.sessoes || []), newSession];

      // Atualizar a campanha com o novo array de sessões
      const response = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaign,
            sessoes: updatedSessoes,
            updatedAt: new Date().toISOString()
          })
        }
      );

      const responseText = await response.text();
      console.log('📥 Resposta da criação de sessão:', responseText);

      if (response.ok) {
        Alert.alert('Sucesso', 'Sessão criada com sucesso!');
        setTitle('');
        setDate('');
        setDuration('');
        setNotes('');
        onClose();
        if (onSessionAdded) {
          onSessionAdded();
        }
      } else {
        Alert.alert('Erro', 'Não foi possível criar a sessão.');
      }
    } catch (err) {
      console.error('Erro ao criar sessão:', err);
      Alert.alert('Erro', 'Não foi possível criar a sessão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>📖 Nova Sessão</Text>
          
          <Text style={modalStyles.label}>Título da Sessão</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: A Caverna Misteriosa"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Data</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: 25/11/2024"
            placeholderTextColor="#6b7280"
            value={date}
            onChangeText={setDate}
            maxLength={20}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Duração</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: 4h"
            placeholderTextColor="#6b7280"
            value={duration}
            onChangeText={setDuration}
            maxLength={10}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Notas (opcional)</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Resumo da sessão..."
            placeholderTextColor="#6b7280"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
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

const SessionsTab = ({ campaignUid }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, [campaignUid]);

  const fetchSessions = async () => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Buscando sessões da campanha:', campaignUid);
      
      const response = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        { method: 'GET' }
      );

      console.log('📊 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`Erro ao buscar campanha: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('📥 Resposta raw:', responseText);
      
      const data = JSON.parse(responseText);
      console.log('✅ Dados da campanha:', data);
      
      // Extrair os dados da campanha
      let campaignData;
      if (data.data) {
        campaignData = data.data;
      } else if (data.campaign) {
        campaignData = data.campaign;
      } else {
        campaignData = data;
      }
      
      console.log('📦 Campanha extraída:', campaignData);
      console.log('📖 Sessões array:', campaignData.sessoes);
      
      // Se sessoes é um array vazio ou não existe, definir como array vazio
      const sessionsArray = Array.isArray(campaignData.sessoes) ? campaignData.sessoes : [];
      
      console.log(`✅ Total de sessões: ${sessionsArray.length}`);
      
      setSessions(sessionsArray);
      
    } catch (err) {
      console.error('❌ Erro ao buscar sessões:', err);
      setError('Não foi possível carregar as sessões');
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAdded = () => {
    fetchSessions();
  };

  const handleViewDetails = (session) => {
    setSelectedSession(session);
    setDetailModalVisible(true);
  };

  const handleDeleteSession = async (sessionId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Buscar a campanha atual
              const getCampaignResponse = await fetchSecure(
                `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
                { method: 'GET' }
              );

              if (!getCampaignResponse.ok) {
                throw new Error('Não foi possível buscar a campanha');
              }

              const campaignText = await getCampaignResponse.text();
              const campaignData = JSON.parse(campaignText);
              
              let campaign;
              if (campaignData.data) {
                campaign = campaignData.data;
              } else if (campaignData.campaign) {
                campaign = campaignData.campaign;
              } else {
                campaign = campaignData;
              }

              // Remover a sessão do array
              const updatedSessoes = (campaign.sessoes || []).filter(
                session => session.id !== sessionId && session._id !== sessionId
              );

              // Atualizar a campanha
              const response = await fetchSecure(
                `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...campaign,
                    sessoes: updatedSessoes,
                    updatedAt: new Date().toISOString()
                  })
                }
              );

              if (response.ok) {
                setSessions(sessions.filter(session => (session.id || session._id) !== sessionId));
                Alert.alert('Sucesso', 'Sessão excluída com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a sessão.');
              }
            } catch (err) {
              console.error('Erro ao excluir sessão:', err);
              Alert.alert('Erro', 'Não foi possível excluir a sessão.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando sessões...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📖 Sessões</Text>
          <Text style={styles.subtitle}>
            {sessions.length} {sessions.length === 1 ? 'sessão' : 'sessões'} realizadas
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.newSessionButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newSessionButtonIcon}>+</Text>
          <Text style={styles.newSessionButtonText}>Nova</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchSessions}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.sessionsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sessionsListContent}
        >
          {sessions.length > 0 ? (
            sessions.map((session, index) => (
              <View
                key={session.id || session._id || `session-${index}`}
                style={styles.sessionCard}
              >
                {/* Session Number Badge */}
                <View style={styles.sessionBadge}>
                  <Text style={styles.sessionBadgeNumber}>{sessions.length - index}</Text>
                </View>

                {/* Session Content */}
                <TouchableOpacity
                  style={styles.sessionContent}
                  onPress={() => handleViewDetails(session)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <View style={styles.sessionMeta}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>📅</Text>
                        <Text style={styles.metaText}>{session.date}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>⏱️</Text>
                        <Text style={styles.metaText}>{session.duration}</Text>
                      </View>
                    </View>
                    {session.notes && (
                      <Text style={styles.sessionPreview} numberOfLines={2}>
                        {session.notes}
                      </Text>
                    )}
                  </View>

                  <View style={styles.sessionActions}>
                    <Text style={styles.viewDetailsArrow}>›</Text>
                  </View>
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSession(session.id || session._id)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📖</Text>
              <Text style={styles.emptyStateTitle}>Nenhuma sessão ainda</Text>
              <Text style={styles.emptyStateText}>
                Crie sua primeira sessão para começar a registrar suas aventuras!
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Criar Primeira Sessão</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <AddSessionModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSessionAdded={handleSessionAdded}
        campaignUid={campaignUid}
      />

      <SessionDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        session={selectedSession}
      />
    </View>
  );
};

// Estilos permanecem os mesmos, apenas adicionando o botão do empty state
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1f3a',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b9dff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  newSessionButtonIcon: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  newSessionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    margin: 16,
    backgroundColor: '#2d1f1f',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  sessionsList: {
    flex: 1,
  },
  sessionsListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sessionCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d3653',
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
    overflow: 'hidden',
  },
  sessionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b9dff',
    zIndex: 10,
  },
  sessionBadgeNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b9dff',
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 64,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  sessionPreview: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  sessionActions: {
    marginLeft: 12,
  },
  viewDetailsArrow: {
    fontSize: 32,
    color: '#3b9dff',
    fontWeight: '300',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
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
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  closeIconText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
  },
  modalContent: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 20,
  },
  sessionTitleLarge: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 28,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3b9dff',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#3b9dff',
    fontWeight: '700',
  },
  notesSection: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  notesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesSectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  notesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  notesText: {
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 22,
  },
  highlightsSection: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  highlightsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightsSectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  highlightsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  highlightBullet: {
    fontSize: 16,
    color: '#3b9dff',
    marginRight: 8,
    fontWeight: '700',
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  modalFooter: {
    marginTop: 20,
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
  closeButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SessionsTab;