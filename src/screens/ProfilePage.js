import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../lib/auth';
import { fetchSecure } from '../lib/fetchSecure';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [characters, setCharacters] = useState([]);

  const navigation = useNavigation();
  const { logout } = useAuth();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const currentUser = authApi.getCurrentUser();

        if (!currentUser) {
          throw new Error('Usuário não autenticado');
        }

        // Buscar dados completos do usuário no backend
        const userRes = await fetchSecure(
          `https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/users/token`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authApi.getIdToken()}`,
            },
          }
        )
        const response = await userRes.json();

        // Os dados do usuário estão dentro de response.data
        const userDataFromBackend = response.data || {};
        console.log('Dados do usuário obtidos do backend:', userDataFromBackend);

        // Mesclar dados do Firebase com dados do backend
        const userData = {
          uid: currentUser.uid,
          displayName: userDataFromBackend.displayName || currentUser.displayName,
          email: userDataFromBackend.email || currentUser.email,
          title: userDataFromBackend.title || '',
          bio: userDataFromBackend.bio || '',
          userPhoto: userDataFromBackend.userPhoto || currentUser.userPhoto,
          createdAt: new Date(currentUser.metadata?.creationTime).toISOString() || new Date().toISOString(),
        };

        setUser(userData);
        console.log('User data loaded:', userData);
        setEditData(userData);

        // Buscar campanhas
        const campaignsRes = await fetchSecure(`https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/campaigns/user/${userData.uid}`);
        const campaignsData = await campaignsRes.json();
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : campaignsData.campaigns || []);

        // Buscar personagens
        const charactersRes = await fetchSecure(`https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/sheets/user/${userData.uid}`);
        const charactersData = await charactersRes.json();
        setCharacters(Array.isArray(charactersData) ? charactersData : charactersData.sheets || []);

      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err.message);
        setError('Não foi possível carregar os dados do usuário.');

      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageSave = () => {
    if (imageUrlInput && imageUrlInput.startsWith('http')) {
      setEditData(prev => ({ ...prev, userPhoto: imageUrlInput }));
    }
    setModalVisible(false);
    setImageUrlInput('');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuário não encontrado.</Text>
      </View>
    );
  }

  const campaignsCount = campaigns.length;
  const charactersCount = characters.length;
  const memberYear = new Date(user.createdAt).getFullYear();

  const handleEditClick = () => {
    setEditData(user);
    setEditing(true);
    setError('');
  };

  const handleCancelClick = () => {
    setEditing(false);
    setError('');
    setEditData(user);
  };

  const handleChange = (name, value) => {
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    setError('');
    if (!editData.displayName || editData.displayName.trim().length < 3) {
      setError('O nome deve ter ao menos 3 caracteres.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetchSecure(
        `https://rollplay-ajejd0eah5dugwej.eastus-01.azurewebsites.net/users/${user.uid}`,
        {
          method: 'PUT',
          body: JSON.stringify(editData)
        }
      );
      const result = await response.json();

      setUser(editData);
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao salvar perfil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      Alert.alert('Erro', 'Falha ao sair. Tente novamente.');
      console.error('Logout error:', err);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={editData?.userPhoto ? { uri: editData.userPhoto } : require("../../assets/default-profile-img.png")}
            style={styles.profileImage}
          />
          {editing && (
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.editImageIcon}>📷</Text>
            </TouchableOpacity>
          )}
        </View>

        {editing ? (
          <View style={styles.editNameSection}>
            <TextInput
              style={styles.input}
              value={editData.displayName || ''}
              onChangeText={(text) => handleChange('displayName', text)}
              placeholder="Nome"
              placeholderTextColor="#6b7280"
            />
          </View>
        ) : (
          <>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TÍTULO</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={editData.title || ''}
              onChangeText={(text) => handleChange('title', text)}
              placeholder="Ex: Mestre de RPG, Aventureiro..."
              placeholderTextColor="#6b7280"
            />
          ) : (
            <Text style={styles.sectionValue}>
              {user.title || 'Nenhum título cadastrado'}
            </Text>
          )}
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BIOGRAFIA</Text>
          {editing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editData.bio || ''}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Conte um pouco sobre você..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.sectionValue}>
              {user.bio || 'Nenhuma biografia cadastrada ainda.'}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🎲</Text>
            <Text style={styles.statNumber}>{campaignsCount}</Text>
            <Text style={styles.statLabel}>Campanhas</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🛡️</Text>
            <Text style={styles.statNumber}>{charactersCount}</Text>
            <Text style={styles.statLabel}>Personagens</Text>
          </View>
        </View>

        {/* Member Since */}
        <View style={styles.memberBox}>
          <Text style={styles.memberIcon}>📅</Text>
          <Text style={styles.memberText}>Membro desde {memberYear}</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorMessage}>⚠️ {error}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {editing ? (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveClick}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {saving ? 'SALVANDO...' : 'SALVAR'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancelClick}
            >
              <Text style={styles.buttonTextSecondary}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={handleEditClick}
            >
              <Text style={styles.buttonText}>EDITAR PERFIL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonTextSecondary}>SAIR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal de edição de imagem */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>
            <Text style={styles.modalSubtitle}>Digite a URL da imagem</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="https://exemplo.com/imagem.jpg"
              placeholderTextColor="#6b7280"
              value={imageUrlInput}
              onChangeText={setImageUrlInput}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleImageSave}
              >
                <Text style={styles.buttonText}>SALVAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonTextSecondary}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e27",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#9ca3af",
    fontWeight: "500",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e27",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },

  /* HEADER */
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  profileImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#3b9dff",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b9dff",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0a0e27",
  },
  editImageIcon: {
    fontSize: 16,
  },

  editNameSection: {
    width: "100%",
    marginBottom: 8,
  },

  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* SECTIONS */
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 10,
    letterSpacing: 1,
  },
  sectionValue: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 24,
  },

  /* INPUT */
  input: {
    backgroundColor: "#1a1f3a",
    borderWidth: 1.5,
    borderColor: "#2d3653",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#ffffff",
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },

  /* STATS */
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#1a1f3a",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2d3653",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3b9dff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "600",
  },

  /* MEMBER BOX */
  memberBox: {
    backgroundColor: "#1a1f3a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2d3653",
  },
  memberIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  memberText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9ca3af",
  },

  /* ERROR */
  errorBox: {
    backgroundColor: "#2d1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  /* BUTTONS */
  buttonsContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 0.5,
  },

  editButton: {
    backgroundColor: "#3b9dff",
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#2d3653",
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#2d3653",
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1a1f3a",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#2d3653",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#0a0e27",
    borderWidth: 1.5,
    borderColor: "#2d3653",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 20,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalSaveButton: {
    backgroundColor: "#3b9dff",
  },
  modalCancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#2d3653",
  },
});