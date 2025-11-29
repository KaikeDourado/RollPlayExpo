import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal, Share, Clipboard } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';

const PlayerCard = ({ player, onPress }) => (
  <TouchableOpacity style={playerCardStyles.card} onPress={onPress}>
    <View style={playerCardStyles.avatarContainer}>
      <Image 
        source={player.avatar ? { uri: player.avatar } : require("../../../assets/default-profile-img.png")} 
        style={playerCardStyles.avatar} 
      />
    </View>
    <View style={playerCardStyles.info}>
      <Text style={playerCardStyles.name}>{player.name || player.displayName || 'Jogador'}</Text>
      {player.character && (
        <>
          <Text style={playerCardStyles.character}>{player.character.name}</Text>
          <Text style={playerCardStyles.details}>
            {player.character.race} • {player.character.class}
          </Text>
          <View style={playerCardStyles.levelBadge}>
            <Text style={playerCardStyles.levelText}>Nível {player.character.level}</Text>
          </View>
        </>
      )}
      {!player.character && (
        <Text style={playerCardStyles.noCharacter}>Nenhum personagem atribuído</Text>
      )}
    </View>
  </TouchableOpacity>
);

const InviteModal = ({ visible, onClose, campaignCode }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Junte-se à minha campanha de RPG! Use o código: ${campaignCode}`,
        title: 'Convite para Campanha'
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleCopyCode = () => {
    Clipboard.setString(campaignCode);
    Alert.alert('Código Copiado', 'O código foi copiado para a área de transferência!');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContainer}>
          <Text style={modalStyles.modalTitle}>🎲 Convidar Jogador</Text>
          <Text style={modalStyles.modalSubtitle}>
            Compartilhe este código com seus amigos
          </Text>
          
          <View style={modalStyles.codeContainer}>
            <Text style={modalStyles.codeLabel}>Código da Campanha</Text>
            <TouchableOpacity onPress={handleCopyCode}>
              <View style={modalStyles.codeBox}>
                <Text style={modalStyles.codeText}>{campaignCode}</Text>
              </View>
            </TouchableOpacity>
            <Text style={modalStyles.copyHint}>Toque para copiar</Text>
          </View>

          <Text style={modalStyles.instructionText}>
            Os jogadores podem usar este código na tela "Entrar em Sessão" para participar da campanha.
          </Text>

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity onPress={handleShare} style={modalStyles.shareButton}>
              <Text style={modalStyles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const PlayersTab = ({ campaignUid }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, [campaignUid]);

  const fetchPlayers = async () => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Buscando campanha:', campaignUid);
      
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
      console.log('👥 Players array:', campaignData.players);
      
      // Se players é um array vazio ou não existe, definir como array vazio
      const playersArray = Array.isArray(campaignData.players) ? campaignData.players : [];
      
      console.log(`✅ Total de jogadores: ${playersArray.length}`);
      
      setPlayers(playersArray);
      
    } catch (err) {
      console.error('❌ Erro ao buscar jogadores:', err);
      setError('Não foi possível carregar os jogadores');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerPress = (player) => {
    const message = player.character 
      ? `Personagem: ${player.character.name}\nRaça: ${player.character.race}\nClasse: ${player.character.class}\nNível: ${player.character.level}`
      : 'Nenhum personagem atribuído';
    
    Alert.alert(
      player.name || player.displayName || 'Jogador',
      message,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando jogadores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>⚔️ Jogadores</Text>
          <Text style={styles.subtitle}>
            {players.length} {players.length === 1 ? 'jogador' : 'jogadores'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.inviteButton} 
          onPress={() => setInviteModalVisible(true)}
        >
          <Text style={styles.inviteButtonText}>+ Convidar</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchPlayers}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.playersGrid}
          showsVerticalScrollIndicator={false}
        >
          {players.length > 0 ? (
            players.map((player, index) => (
              <PlayerCard 
                key={player.uid || player.id || player._id || `player-${index}`} 
                player={player}
                onPress={() => handlePlayerPress(player)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👥</Text>
              <Text style={styles.emptyStateTitle}>Nenhum jogador ainda</Text>
              <Text style={styles.emptyStateText}>
                Convide seus amigos para começar a aventura!
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setInviteModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Convidar Jogadores</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <InviteModal 
        visible={inviteModalVisible}
        onClose={() => setInviteModalVisible(false)}
        campaignCode={campaignUid}
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
  inviteButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  inviteButtonText: {
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
  playersGrid: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
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

const playerCardStyles = StyleSheet.create({
  card: {
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
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2d3653',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  character: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b9dff',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 6,
  },
  levelBadge: {
    backgroundColor: '#0a0e27',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  levelText: {
    fontSize: 12,
    color: '#3b9dff',
    fontWeight: '600',
  },
  noCharacter: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeBox: {
    backgroundColor: '#0a0e27',
    borderWidth: 2,
    borderColor: '#3b9dff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3b9dff',
    letterSpacing: 1,
  },
  copyHint: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  instructionText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#3b9dff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  closeButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2d3653',
  },
  closeButtonText: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PlayersTab;