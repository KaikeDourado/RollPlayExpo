import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSecure } from '../../lib/fetchSecure';
import { authApi } from '../../lib/auth';

const CharacterSelectModal = ({ onClose, campaignUid }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchCharacters();
  }, [campaignUid]);

  const fetchCharacters = async () => {
    setLoading(true);
    setError('');
    try {
      const currentUser = authApi.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar fichas do usuário que pertencem a esta campanha
      const response = await fetchSecure(
        `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/sheets/token/1762008485571`,
        { method: 'GET' }
      );

      if (response.ok) {
        const data = await response.json();
        setCharacters(data.sheets || []);
      } else {
        setError('Erro ao carregar personagens');
      }
    } catch (err) {
      console.error('Erro ao buscar personagens:', err);
      setError('Não foi possível carregar os personagens');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharacter = (character) => {
    onClose();
    // Pequeno delay para garantir que o modal fecha antes da navegação
    setTimeout(() => {
      navigation.navigate('Sheet', { id: character.uid || character._id });
    }, 100);
  };

  const handleCreateCharacter = () => {
    onClose();
    setTimeout(() => {
      navigation.navigate('CreateCharacter', { campaignUid });
    }, 100);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.handleBar} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b9dff" />
          <Text style={styles.loadingText}>Carregando personagens...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Handle Bar para drag */}
      <View style={styles.handleBar} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>📋</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Seus Personagens</Text>
            <Text style={styles.subtitle}>Selecione uma ficha para visualizar</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : characters.length > 0 ? (
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.characterCard}
              onPress={() => handleSelectCharacter(item)}
              activeOpacity={0.7}
            >
              <View style={styles.characterImageContainer}>
                <Image 
                  source={
                    item.avatar 
                      ? { uri: item.avatar } 
                      : require('../../../assets/default-profile-img.png')
                  }
                  style={styles.characterImage}
                />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{item.level || 1}</Text>
                </View>
              </View>
              
              <View style={styles.characterInfo}>
                <Text style={styles.characterName}>{item.name}</Text>
                <View style={styles.characterDetails}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>{item.race || 'Raça'}</Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>{item.class || 'Classe'}</Text>
                  </View>
                </View>
                {item.background && (
                  <Text style={styles.characterBackground} numberOfLines={1}>
                    {item.background}
                  </Text>
                )}
              </View>

              <View style={styles.arrowContainer}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📜</Text>
          <Text style={styles.emptyStateTitle}>Nenhum personagem</Text>
          <Text style={styles.emptyStateText}>
            Você ainda não criou nenhum personagem para esta campanha.
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateCharacter}
          >
            <Text style={styles.createButtonText}>+ Criar Personagem</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer com botão de criar */}
      {characters.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.createButtonFooter}
            onPress={handleCreateCharacter}
          >
            <Text style={styles.createButtonFooterIcon}>+</Text>
            <Text style={styles.createButtonFooterText}>Criar Novo Personagem</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#2d3653',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
    marginLeft: 12,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  characterCard: {
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
  characterImageContainer: {
    position: 'relative',
    marginRight: 14,
  },
  characterImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b9dff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0e27',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  characterDetails: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  detailBadge: {
    backgroundColor: '#0a0e27',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  detailText: {
    fontSize: 12,
    color: '#3b9dff',
    fontWeight: '600',
  },
  characterBackground: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 28,
    color: '#3b9dff',
    fontWeight: '300',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  createButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0e27',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2d3653',
  },
  createButtonFooter: {
    backgroundColor: '#3b9dff',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonFooterIcon: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
  createButtonFooterText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CharacterSelectModal;