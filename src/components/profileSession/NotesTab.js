import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const AddNoteModal = ({ visible, onClose, onNoteAdded, campaignUid }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erro', 'Título e conteúdo não podem estar vazios.');
      return;
    }

    setLoading(true);
    try {
      // Primeiro, buscar a campanha atual para obter o array de notas
      const getCampaignResponse = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
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

      // Criar a nova nota
      const newNote = {
        id: Date.now().toString(), // ID único baseado em timestamp
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString()
      };

      // Adicionar a nova nota ao array existente
      const updatedNotas = [...(campaign.notas || []), newNote];

      // Atualizar a campanha com o novo array de notas
      const response = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaign,
            notas: updatedNotas,
            updatedAt: new Date().toISOString()
          })
        }
      );

      const responseText = await response.text();
      console.log('📥 Resposta da criação de nota:', responseText);

      if (response.ok) {
        Alert.alert('Sucesso', 'Nota adicionada com sucesso!');
        setTitle('');
        setContent('');
        onClose();
        if (onNoteAdded) {
          onNoteAdded();
        }
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar a nota.');
      }
    } catch (err) {
      console.error('Erro ao adicionar nota:', err);
      Alert.alert('Erro', 'Não foi possível adicionar a nota. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>📝 Nova Nota</Text>
          
          <Text style={modalStyles.label}>Título</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Pistas importantes"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Conteúdo</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Escreva suas anotações..."
            placeholderTextColor="#6b7280"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            maxLength={2000}
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
                <Text style={modalStyles.createButtonText}>Salvar</Text>
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

const NotesTab = ({ campaignUid }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [campaignUid]);

  const fetchNotes = async () => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Buscando notas da campanha:', campaignUid);
      
      const response = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
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
      console.log('📝 Notas array:', campaignData.notas);
      
      // Se notas é um array vazio ou não existe, definir como array vazio
      const notesArray = Array.isArray(campaignData.notas) ? campaignData.notas : [];
      
      console.log(`✅ Total de notas: ${notesArray.length}`);
      
      setNotes(notesArray);
      
    } catch (err) {
      console.error('❌ Erro ao buscar notas:', err);
      setError('Não foi possível carregar as notas');
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAdded = () => {
    fetchNotes();
  };

  const handleDeleteNote = async (noteId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Buscar a campanha atual
              const getCampaignResponse = await fetchSecure(
                `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
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

              // Remover a nota do array
              const updatedNotas = (campaign.notas || []).filter(
                note => note.id !== noteId && note._id !== noteId
              );

              // Atualizar a campanha
              const response = await fetchSecure(
                `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...campaign,
                    notas: updatedNotas,
                    updatedAt: new Date().toISOString()
                  })
                }
              );

              if (response.ok) {
                setNotes(notes.filter(note => (note.id || note._id) !== noteId));
                Alert.alert('Sucesso', 'Nota excluída com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir a nota.');
              }
            } catch (err) {
              console.error('Erro ao excluir nota:', err);
              Alert.alert('Erro', 'Não foi possível excluir a nota.');
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
        <Text style={styles.loadingText}>Carregando notas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📝 Notas</Text>
          <Text style={styles.subtitle}>
            {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchNotes}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.notesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.notesListContent}
        >
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <View key={note.id || note._id || `note-${index}`} style={styles.noteItem}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                  <TouchableOpacity 
                    onPress={() => handleDeleteNote(note.id || note._id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent} numberOfLines={3}>
                  {note.content}
                </Text>
                {note.createdAt && (
                  <Text style={styles.noteDate}>
                    {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📝</Text>
              <Text style={styles.emptyStateTitle}>Nenhuma nota ainda</Text>
              <Text style={styles.emptyStateText}>
                Crie suas primeiras anotações para registrar informações importantes da campanha!
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Criar Primeira Nota</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <AddNoteModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNoteAdded={handleNoteAdded}
        campaignUid={campaignUid}
      />
    </View>
  );
};

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
  addButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addButtonText: {
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
  notesList: {
    flex: 1,
  },
  notesListContent: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2d3653',
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  noteContent: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
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
    borderWidth: 1,
    borderColor: '#2d3653',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
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
    minHeight: 150,
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

export default NotesTab;