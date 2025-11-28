import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const AddNPCModal = ({ visible, onClose, onNPCAdded, campaignUid }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !role.trim()) {
      Alert.alert('Erro', 'Nome e papel são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const npcData = {
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        campaignId: campaignUid,
        createdAt: new Date().toISOString()
      };

      const response = await fetchSecure(
        `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/campaigns/${campaignUid}/npcs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(npcData)
        }
      );

      if (response.ok) {
        const newNPC = await response.json();
        Alert.alert('Sucesso', 'NPC adicionado com sucesso!');
        setName('');
        setRole('');
        setDescription('');
        onClose();
        if (onNPCAdded) {
          onNPCAdded(newNPC);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Erro', errorData.message || 'Não foi possível adicionar o NPC.');
      }
    } catch (err) {
      console.error('Erro ao adicionar NPC:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o NPC. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>🧙 Novo NPC</Text>
          
          <Text style={modalStyles.label}>Nome</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Grommash"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            maxLength={50}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Papel/Função</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Ferreiro"
            placeholderTextColor="#6b7280"
            value={role}
            onChangeText={setRole}
            maxLength={50}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descreva o NPC..."
            placeholderTextColor="#6b7280"
            value={description}
            onChangeText={setDescription}
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

const NPCsTab = ({ campaignUid }) => {
  const [npcs, setNpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNPCs();
  }, [campaignUid]);

  const fetchNPCs = async () => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchSecure(
        `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/campaigns/${campaignUid}/npcs`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        setNpcs(data.npcs || []);
      } else {
        setError('Erro ao carregar NPCs');
      }
    } catch (err) {
      console.error('Erro ao buscar NPCs:', err);
      setError('Não foi possível carregar os NPCs');
    } finally {
      setLoading(false);
    }
  };

  const handleNPCAdded = () => {
    fetchNPCs();
  };

  const handleViewDetails = (npc) => {
    Alert.alert(
      npc.name,
      `Papel: ${npc.role}\n\n${npc.description || 'Sem descrição'}`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteNPC = async (npcId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este NPC?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetchSecure(
                `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/campaigns/${campaignUid}/npcs/${npcId}`,
                { method: 'DELETE' }
              );

              if (response.ok) {
                setNpcs(npcs.filter(npc => (npc.id || npc._id) !== npcId));
                Alert.alert('Sucesso', 'NPC excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o NPC.');
              }
            } catch (err) {
              console.error('Erro ao excluir NPC:', err);
              Alert.alert('Erro', 'Não foi possível excluir o NPC.');
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
        <Text style={styles.loadingText}>Carregando NPCs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🧙 NPCs</Text>
          <Text style={styles.subtitle}>
            {npcs.length} {npcs.length === 1 ? 'NPC' : 'NPCs'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.npcsGrid}
          showsVerticalScrollIndicator={false}
        >
          {npcs.length > 0 ? (
            npcs.map(npc => (
              <TouchableOpacity
                key={npc.id || npc._id}
                style={styles.npcCard}
                onPress={() => handleViewDetails(npc)}
              >
                <View style={styles.npcAvatarContainer}>
                  <Image 
                    source={npc.avatar ? { uri: npc.avatar } : require("../../../assets/default-profile-img.png")} 
                    style={styles.npcAvatar} 
                  />
                </View>
                <View style={styles.npcInfo}>
                  <Text style={styles.npcName}>{npc.name}</Text>
                  <View style={styles.npcRoleBadge}>
                    <Text style={styles.npcRole}>{npc.role}</Text>
                  </View>
                  {npc.description && (
                    <Text style={styles.npcDescription} numberOfLines={2}>
                      {npc.description}
                    </Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteNPC(npc.id || npc._id);
                  }}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🧙</Text>
              <Text style={styles.emptyStateTitle}>Nenhum NPC ainda</Text>
              <Text style={styles.emptyStateText}>
                Adicione personagens não-jogadores para enriquecer sua campanha!
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <AddNPCModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNPCAdded={handleNPCAdded}
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
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  npcsGrid: {
    padding: 16,
  },
  npcCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
  },
  npcAvatarContainer: {
    marginRight: 14,
  },
  npcAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  npcInfo: {
    flex: 1,
  },
  npcName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  npcRoleBadge: {
    backgroundColor: '#0a0e27',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2d3653',
    marginBottom: 6,
  },
  npcRole: {
    fontSize: 12,
    color: '#3b9dff',
    fontWeight: '600',
  },
  npcDescription: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 20,
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

export default NPCsTab;