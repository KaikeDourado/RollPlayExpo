import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const AddMapModal = ({ visible, onClose, onMapAdded, campaignUid }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      // Primeiro, buscar a campanha atual para obter o array de mapas
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

      // Criar o novo mapa
      const newMap = {
        id: Date.now().toString(), // ID único baseado em timestamp
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        createdAt: new Date().toISOString()
      };

      // Adicionar o novo mapa ao array existente
      const updatedMapas = [...(campaign.mapas || []), newMap];

      // Atualizar a campanha com o novo array de mapas
      const response = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaign,
            mapas: updatedMapas,
            updatedAt: new Date().toISOString()
          })
        }
      );

      const responseText = await response.text();
      console.log('📥 Resposta da criação de mapa:', responseText);

      if (response.ok) {
        Alert.alert('Sucesso', 'Mapa adicionado com sucesso!');
        setTitle('');
        setDescription('');
        setImageUrl('');
        onClose();
        if (onMapAdded) {
          onMapAdded();
        }
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar o mapa.');
      }
    } catch (err) {
      console.error('Erro ao adicionar mapa:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o mapa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>🗺️ Novo Mapa</Text>

          <Text style={modalStyles.label}>Título</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Mapa da Cidade"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descreva o mapa..."
            placeholderTextColor="#6b7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={300}
            editable={!loading}
          />

          <Text style={modalStyles.label}>URL da Imagem (opcional)</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="https://exemplo.com/mapa.jpg"
            placeholderTextColor="#6b7280"
            value={imageUrl}
            onChangeText={setImageUrl}
            maxLength={500}
            editable={!loading}
            autoCapitalize="none"
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

const EditMapModal = ({ visible, onClose, onMapUpdated, campaignUid, selectedMap }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedMap) {
      setTitle(selectedMap.title || '');
      setDescription(selectedMap.description || '');
      setImageUrl(selectedMap.imageUrl || '');
    }
  }, [selectedMap]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'O título é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      const getCampaignResponse = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        { method: 'GET' }
      );

      if (!getCampaignResponse.ok) {
        throw new Error('Não foi possível buscar a campanha');
      }

      const campaignData = JSON.parse(await getCampaignResponse.text());
      const campaign = campaignData.data || campaignData.campaign || campaignData;

      const selectedId = selectedMap.id || selectedMap._id;

      const updatedMapas = (campaign.mapas || []).map((map) => {
        const mapId = map.id || map._id;

        if (mapId !== selectedId) return map;

        return {
          ...map,
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          updatedAt: new Date().toISOString(),
        };
      });

      const response = await fetchSecure(
        `https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net/campaigns/${campaignUid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...campaign,
            mapas: updatedMapas,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o mapa.');
      }

      Alert.alert('Sucesso', 'Mapa atualizado com sucesso!');
      onClose();

      if (onMapUpdated) {
        onMapUpdated();
      }
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível atualizar o mapa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>✏️ Editar Mapa</Text>

          <Text style={modalStyles.label}>Título</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Ex: Mapa da Cidade"
            placeholderTextColor="#6b7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!loading}
          />

          <Text style={modalStyles.label}>Descrição</Text>
          <TextInput
            style={[modalStyles.input, modalStyles.textArea]}
            placeholder="Descreva o mapa..."
            placeholderTextColor="#6b7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            maxLength={300}
            editable={!loading}
          />

          <Text style={modalStyles.label}>URL da Imagem</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="https://exemplo.com/mapa.jpg"
            placeholderTextColor="#6b7280"
            value={imageUrl}
            onChangeText={setImageUrl}
            maxLength={500}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleUpdate}
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

const MapsTab = ({ campaignUid }) => {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    fetchMaps();
  }, [campaignUid]);

  const fetchMaps = async () => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Buscando mapas da campanha:', campaignUid);

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
      console.log('🗺️ Mapas array:', campaignData.mapas);

      // Se mapas é um array vazio ou não existe, definir como array vazio
      const mapsArray = Array.isArray(campaignData.mapas) ? campaignData.mapas : [];

      console.log(`✅ Total de mapas: ${mapsArray.length}`);

      setMaps(mapsArray);

    } catch (err) {
      console.error('❌ Erro ao buscar mapas:', err);
      setError('Não foi possível carregar os mapas');
    } finally {
      setLoading(false);
    }
  };

  const handleMapAdded = () => {
    fetchMaps();
  };

  const handleEditMap = (map) => {
    setSelectedMap(map);
    setEditModalVisible(true);
  };

  const handleViewMap = (map) => {
    Alert.alert(
      map.title,
      map.description || 'Sem descrição',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteMap = async (mapId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir este mapa?',
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

              // Remover o mapa do array
              const updatedMapas = (campaign.mapas || []).filter(
                map => map.id !== mapId && map._id !== mapId
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
                    mapas: updatedMapas,
                    updatedAt: new Date().toISOString()
                  })
                }
              );

              if (response.ok) {
                setMaps(maps.filter(map => (map.id || map._id) !== mapId));
                Alert.alert('Sucesso', 'Mapa excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o mapa.');
              }
            } catch (err) {
              console.error('Erro ao excluir mapa:', err);
              Alert.alert('Erro', 'Não foi possível excluir o mapa.');
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
        <Text style={styles.loadingText}>Carregando mapas...</Text>
      </View>

    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🗺️ Mapas</Text>
          <Text style={styles.subtitle}>
            {maps.length} {maps.length === 1 ? 'mapa' : 'mapas'}
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchMaps}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.mapsGrid}
          showsVerticalScrollIndicator={false}
        >
          {maps.length > 0 ? (
            maps.map((map, index) => (
              <TouchableOpacity
                key={map.id || map._id || `map-${index}`}
                style={styles.mapCard}
                onPress={() => handleViewMap(map)}
              >
                <View style={styles.mapImageContainer}>
                  <Image
                    source={
                      map.imageUrl
                        ? { uri: map.imageUrl }
                        : require("../../../assets/default-map-img.png")
                    }
                    style={styles.mapImage}
                  />
                  <View style={styles.mapOverlay}>
                    <TouchableOpacity
                      style={styles.mapActionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditMap(map);
                      }}
                    >
                      <Text style={styles.mapActionButtonText}>✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.mapActionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteMap(map.id || map._id);
                      }}
                    >
                      <Text style={styles.mapActionButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.mapInfo}>
                  <Text style={styles.mapTitle}>{map.title}</Text>
                  {map.description && (
                    <Text style={styles.mapDescription} numberOfLines={2}>
                      {map.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🗺️</Text>
              <Text style={styles.emptyStateTitle}>Nenhum mapa ainda</Text>
              <Text style={styles.emptyStateText}>
                Adicione mapas para ajudar seus jogadores a visualizar o mundo da campanha!
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Adicionar Primeiro Mapa</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <AddMapModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onMapAdded={handleMapAdded}
        campaignUid={campaignUid}
      />

      <EditMapModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedMap(null);
        }}
        onMapUpdated={fetchMaps}
        campaignUid={campaignUid}
        selectedMap={selectedMap}
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
  mapsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mapCard: {
    width: '48%',
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  mapImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    flexDirection: 'row',
    gap: 6,
  },

  mapActionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 6,
  },

  mapActionButtonText: {
    fontSize: 16,
  },
  mapInfo: {
    padding: 12,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  mapDescription: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  emptyState: {
    width: '100%',
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
    minHeight: 80,
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

export default MapsTab;