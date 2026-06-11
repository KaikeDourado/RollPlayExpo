import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const EditCampaignModal = ({ visible, onClose, campaignData, onSave }) => {
  const [name, setName] = useState(campaignData?.name || '');
  const [description, setDescription] = useState(campaignData?.description || '');
  const [system, setSystem] = useState(campaignData?.system || 'D&D 5e');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da campanha é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const updatedData = {
        name: name.trim(),
        description: description.trim(),
        system: system.trim(),
      };

      const response = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignData.uid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedCampaign = data.campaign;

        Alert.alert('Sucesso', 'Campanha atualizada com sucesso!');
        onClose();

        if (onSave) {
          onSave(updatedCampaign);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert('Erro', errorData.message || 'Não foi possível atualizar a campanha.');
      }
    } catch (err) {
      console.error('Erro ao atualizar campanha:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a campanha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>✏️ Editar Campanha</Text>

          <Text style={modalStyles.label}>Nome</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Nome da campanha"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
            maxLength={100}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Sistema</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: D&D 5e"
            placeholderTextColor="#6b7280"
            value={system}
            onChangeText={setSystem}
            maxLength={50}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descreva sua campanha..."
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
              onPress={handleSave}
              style={[modalStyles.saveButton, loading && { opacity: 0.6 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={modalStyles.saveButtonText}>Salvar</Text>
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

const GeneralTab = ({ campaignData, campaignUid, onDataUpdate }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [localCampaignData, setLocalCampaignData] = useState(campaignData);

  useEffect(() => {
  setLocalCampaignData(campaignData);
}, [campaignData]);

  const createdAtDate = localCampaignData?.createdAt ? new Date(localCampaignData.createdAt) : null;
  const formattedCreatedAt = createdAtDate && !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    : 'Data desconhecida';

  const campaign = {
    name: localCampaignData?.name || 'Nome da Campanha',
    system: localCampaignData?.system || 'D&D 5e',
    createdAt: formattedCreatedAt,
    description: localCampaignData?.description || 'Sem descrição',
    playersCount: localCampaignData?.players?.length || 0,
    profileImage: localCampaignData?.profileImage
      ? { uri: localCampaignData.profileImage }
      : require('../../../assets/default-campaign-img.png'),
  };

  const handleSave = (updatedData) => {
    setLocalCampaignData(updatedData);
    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >

      {/* Profile Image */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={campaign.profileImage}
            style={styles.profileImage}
          />
          <View style={styles.profileImageBorder} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Header with Title and Edit Button */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{campaign.name}</Text>
            <View style={styles.systemBadge}>
              <Text style={styles.systemText}>🎲 {campaign.system}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>👥</Text>
            </View>
            <Text style={styles.statValue}>{campaign.playersCount}</Text>
            <Text style={styles.statLabel}>Jogador(es)</Text>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {/* Creation Date Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardIconContainer}>
                <Text style={styles.infoCardIcon}>📅</Text>
              </View>
              <Text style={styles.infoCardTitle}>Data de Criação</Text>
            </View>
            <Text style={styles.infoCardValue}>{campaign.createdAt}</Text>
          </View>

          {/* Description Card */}
          <View style={[styles.infoCard, styles.descriptionCard]}>
            <View style={styles.infoCardHeader}>
              <View style={styles.infoCardIconContainer}>
                <Text style={styles.infoCardIcon}>📝</Text>
              </View>
              <Text style={styles.infoCardTitle}>Sobre a Campanha</Text>
            </View>
            <Text style={styles.descriptionText}>{campaign.description}</Text>
          </View>
        </View>
      </View>

      <EditCampaignModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        campaignData={localCampaignData}
        onSave={handleSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  scrollContent: {
    paddingBottom: 0, // Espaço extra para o botão de ficha
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    zIndex: 10,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 18,
    borderWidth: 6,
    borderColor: '#0a0e27',
    resizeMode: 'cover',
  },
  profileImageBorder: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#3b9dff',
    top: 0,
    left: 0,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 34,
  },
  systemBadge: {
    backgroundColor: '#1a1f3a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  systemText: {
    fontSize: 13,
    color: '#3b9dff',
    fontWeight: '700',
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b9dff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b9dff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButtonIcon: {
    fontSize: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoSection: {
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  descriptionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b9dff',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  infoCardIcon: {
    fontSize: 18,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 16,
    color: '#3b9dff',
    fontWeight: '700',
    marginLeft: 46,
  },
  descriptionText: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 24,
    marginLeft: 46,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
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

export default GeneralTab;