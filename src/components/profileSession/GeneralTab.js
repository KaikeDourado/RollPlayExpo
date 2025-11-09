import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const GeneralTab = ({ campaignData }) => {
  // Dados de exemplo (substitua por props reais)
  const campaign = {
    name: campaignData?.name || 'Nome da Campanha',
    system: 'D&D 5E',
    sessionsCount: 12,
    createdAt: '15/08/2023',
    description: 'Uma épica aventura em um mundo de fantasia medieval onde heróis se unem para enfrentar antigas ameaças e descobrir segredos ancestrais.',
    profileImage: require('../../../assets/default-campaign-img.png'),
    bannerImage: require('../../../assets/default-profile-img.png'),
  };

  const handleEdit = () => {
    // Implementar lógica de edição
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image 
          source={campaign.bannerImage}
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.profileImageContainer}>
        <Image 
          source={campaign.profileImage}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{campaign.name}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEdit}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sistema</Text>
            <Text style={styles.infoValue}>{campaign.system}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sessões Realizadas</Text>
            <Text style={styles.infoValue}>{campaign.sessionsCount}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Criada em</Text>
            <Text style={styles.infoValue}>{campaign.createdAt}</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descrição</Text>
          <Text style={styles.descriptionText}>{campaign.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default GeneralTab;