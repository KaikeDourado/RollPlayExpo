
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext.jsx';
// Para ícones, você pode usar @expo/vector-icons, por exemplo:
// import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * @function ProfilePage
 * @description Tela de Perfil do usuário no aplicativo React Native.
 * Adaptada do projeto React original, convertendo elementos HTML para componentes React Native,
 * removendo a lógica de backend (axios, localStorage/sessionStorage) e adaptando a navegação.
 * A funcionalidade de edição de perfil é mantida, mas as chamadas de API são desativadas.
 */
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [characters, setCharacters] = useState([]);

  const navigation = useNavigation();
  const { logout } = useAuth();

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isEnterSessionModalOpen, setIsEnterSessionModalOpen] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    // Simulação de carregamento de dados do usuário e campanhas
    // Em um cenário real, você faria chamadas de API aqui
    const simulatedFetchData = () => {
      setLoading(true);
      setTimeout(() => {
        const dummyUser = {
          displayName: 'Aventureiro Teste',
          title: 'Mestre de RPG',
          bio: 'Um mestre experiente em D&D 5e, sempre em busca de novas aventuras e histórias para contar.',
          photoURL: null, // Pode ser uma URL de imagem ou null
          createdAt: '2023-01-15T10:00:00Z',
          charactersCount: 3,
        };
        const dummyCampaigns = [
          { id: '1', name: 'A Lenda de Eldoria' },
          { id: '2', name: 'As Ruínas de Thandor' },
        ];
        const dummyCharacters = [
          { id: 'c1', name: 'Gandalf, o Cinzento' },
          { id: 'c2', name: 'Legolas, o Arqueiro' },
          { id: 'c3', name: 'Gimli, o Anão' },
        ];

        setUser(dummyUser);
        setEditData(dummyUser);
        setCampaigns(dummyCampaigns);
        setCharacters(dummyCharacters);
        setLoading(false);
      }, 1500);
    };

    simulatedFetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (error && !editing) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!user) {
    return <Text style={styles.errorText}>Usuário não encontrado.</Text>;
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
    // Simulação de salvamento
    setTimeout(() => {
      setUser(editData);
      setEditing(false);
      setSaving(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    }, 1000);
  };

  
  const handleLogout = async () => {
    try {
      await logout();
      // caso queira forçar navegação para tela de login:
      // navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao sair. Tente novamente.');
      console.error('Logout error:', err);
    }
  };

  const handleCreateCharacter = () => {
    // Simulação de criação de personagem
    Alert.alert('Funcionalidade', 'Criar personagem será implementado com a integração de backend.');
    // navigation.navigate('Sheet', { characterId: 'new' });
  };

  const handleOpenSessionModal = () => setIsSessionModalOpen(true);
  const handleCloseSessionModal = () => setIsSessionModalOpen(false);
  const handleOpenEnterSessionModal = () => setIsEnterSessionModalOpen(true);
  const handleCloseEnterSessionModal = () => setIsEnterSessionModalOpen(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.imageContainer}>
          <Image
            source={editData?.photoURL ? { uri: editData.photoURL } : require("../../assets/default-profile-img.png")}
            style={styles.profileImage}
          />
          {editing && (
            <TouchableOpacity style={styles.editProfileImage} onPress={() => Alert.alert('Upload de Imagem', 'Funcionalidade de upload de imagem a ser implementada.')}>
              <Text style={styles.editProfileImageText}>✎</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.profileInfo}>
          {editing ? (
            <>
              <TextInput
                style={styles.input}
                value={editData.displayName || ''}
                onChangeText={(text) => handleChange('displayName', text)}
                placeholder="Nome"
              />
              <TextInput
                style={styles.input}
                value={editData.title || ''}
                onChangeText={(text) => handleChange('title', text)}
                placeholder="Título"
              />
            </>
          ) : (
            <>
              <Text style={styles.profileName}>{user.displayName}</Text>
              <Text style={styles.profileTitle}>{user.title || 'MESTRE DE RPG'}</Text>
            </>
          )}
        </View>

        <View style={styles.profileBio}>
          <Text style={styles.bioTitle}>BIO</Text>
          {editing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={editData.bio || ''}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Biografia"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.bioText}>{user.bio || 'Nenhuma biografia cadastrada.'}</Text>
          )}
        </View>

        <View style={styles.profileStats}>
          <Text style={styles.statItem}>🎲 {campaignsCount} CAMPANHAS CRIADAS</Text>
          <Text style={styles.statItem}>🛡️ {charactersCount} PERSONAGENS CRIADOS</Text>
          <Text style={styles.statItem}>📅 MEMBRO DESDE {memberYear}</Text>
        </View>

        <View style={styles.profileActions}>
          {editing ? (
            <>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveClick} disabled={saving}>
                <Text style={styles.buttonText}>{saving ? 'SALVANDO...' : 'SALVAR'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelButton, { marginLeft: 10 }]} onPress={handleCancelClick}>
                <Text style={styles.buttonText}>CANCELAR</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.editButton} onPress={handleEditClick}>
                <Text style={styles.buttonText}>EDITAR PERFIL</Text>
              </TouchableOpacity>

              {/* Botão de Sair adicionado */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>SAIR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MINHAS CAMPANHAS</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleOpenSessionModal}>
            <Text style={styles.createButtonText}>+ CRIAR CAMPANHA</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.campaignGrid}>
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={styles.campaignCard}
                onPress={() => navigation.navigate('ProfileSession', { campaignUid: campaign.id })}
              >
                <Image source={require("../../assets/default-campaign-img.png")} style={styles.campaignImage} />
                <Text style={styles.campaignName}>{campaign.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noItemsText}>Nenhuma campanha criada ainda.</Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MEUS PERSONAGENS</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateCharacter}>
            <Text style={styles.createButtonText}>+ CRIAR PERSONAGEM</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.characterGrid}>
          {characters.length > 0 ? (
            characters.map((character) => (
              <TouchableOpacity key={character.id} style={styles.characterCard} onPress={() => Alert.alert('Personagem', `Navegar para ${character.name}`)}>
                <Image source={require("../../assets/sheet-generic-img.png")} style={styles.characterImage} />
                <Text style={styles.characterName}>{character.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noItemsText}>Nenhum personagem criado ainda.</Text>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ENTRAR EM SESSÃO</Text>
          <TouchableOpacity style={styles.enterSessionButton} onPress={handleOpenEnterSessionModal}>
            <Text style={styles.enterSessionButtonText}>ENTRAR EM SESSÃO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals para criar/entrar em sessão - apenas placeholders */}
      {isSessionModalOpen && <SessionModal onClose={handleCloseSessionModal} />}
      {isEnterSessionModalOpen && <EnterSessionModal onClose={handleCloseEnterSessionModal} />}
    </ScrollView>
  );
}

// Componentes de Modal (placeholders)
const SessionModal = ({ onClose }) => (
  <View style={modalStyles.overlay}>
    <View style={modalStyles.modalContainer}>
      <Text style={modalStyles.modalTitle}>Criar Nova Campanha</Text>
      <Text>Formulário de criação de campanha aqui...</Text>
      <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
        <Text style={modalStyles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const EnterSessionModal = ({ onClose }) => (
  <View style={modalStyles.overlay}>
    <View style={modalStyles.modalContainer}>
      <Text style={modalStyles.modalTitle}>Entrar em Sessão</Text>
      <Text>Formulário para entrar em sessão aqui...</Text>
      <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
        <Text style={modalStyles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

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
  sidebar: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  editProfileImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  profileBio: {
    width: '100%',
    marginBottom: 20,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  profileStats: {
    marginBottom: 20,
  },
  statItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  campaignGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  campaignCard: {
    width: '48%', // Ajuste para duas colunas
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  campaignImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  characterCard: {
    width: '48%', // Ajuste para duas colunas
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  characterImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },
  enterSessionButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  enterSessionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
    logoutButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

