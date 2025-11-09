
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';

// Placeholder para o componente PlayerCard
const PlayerCard = ({ player }) => (
  <TouchableOpacity style={playerCardStyles.card} onPress={() => Alert.alert(
    'Detalhes do Jogador',
    `Nome: ${player.name}\nRaça: ${player.race}\nClasse: ${player.class}\nNível: ${player.level}`
  )}>
    <Image source={require("../../../assets/default-profile-img.png")} style={playerCardStyles.avatar} />
    <Text style={playerCardStyles.name}>{player.name}</Text>
    <Text style={playerCardStyles.details}>{player.race} - Nível {player.level}</Text>
  </TouchableOpacity>
);

/**
 * @function PlayersTab
 * @description Componente de aba para exibir os jogadores de uma campanha no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native,
 * removendo a lógica de backend (axios) e utilizando dados simulados.
 * @param {string} campaignUid O UID da campanha atual.
 */
const PlayersTab = ({ campaignUid }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!campaignUid) {
      setError("UID da campanha não fornecido.");
      setLoading(false);
      return;
    }

    // Simulação de busca de jogadores
    setLoading(true);
    setTimeout(() => {
      const simulatedPlayers = [
        {
          id: 'p1',
          name: 'Aventureiro A',
          race: 'Elfo',
          class: 'Guerreiro',
          level: 5,
        },
        {
          id: 'p2',
          name: 'Aventureira B',
          race: 'Humano',
          class: 'Mago',
          level: 4,
        },
        {
          id: 'p3',
          name: 'Aventureiro C',
          race: 'Anão',
          class: 'Clérigo',
          level: 6,
        },
      ];
      setPlayers(simulatedPlayers);
      setLoading(false);
    }, 1000);
  }, [campaignUid]);

  const handleInvitePlayer = () => {
    Alert.alert('Convidar Jogador', 'Funcionalidade de convite a ser implementada com o backend.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>JOGADORES</Text>
        <TouchableOpacity style={styles.inviteButton} onPress={handleInvitePlayer}>
          <Text style={styles.inviteButtonText}>+ CONVIDAR</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.playersGrid}>
          {players.length > 0 ? (
            players.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))
          ) : (
            <Text style={styles.noPlayersText}>Nenhum jogador nesta campanha ainda.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  inviteButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  noPlayersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
  },
});

const playerCardStyles = StyleSheet.create({
  card: {
    width: '48%', // Ajuste para duas colunas
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default PlayersTab;

