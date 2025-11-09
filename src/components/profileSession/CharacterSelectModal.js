import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Animated } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SheetPage from '../../screens/SheetPage';

const CharacterSelectModal = ({ characters, onClose }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  if (selectedCharacter) {
    return (
      <View style={styles.fullScreenContainer}>
        <SheetPage route={{ params: { id: selectedCharacter.id } }} />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setSelectedCharacter(null)}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecione seu Personagem</Text>
      </View>
      
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.characterItem}
            onPress={() => handleSelectCharacter(item)}
          >
            <Image 
              source={require('../../../assets/ferreiro.jpg')}
              style={styles.characterImage}
            />
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{item.name}</Text>
              <Text style={styles.characterClass}>{item.class} - Nível {item.level}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#131525',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#131525',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    marginTop: 14,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#020717',
    alignItems: 'center',
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  characterClass: {
    fontSize: 14,
    color: '#ffffffff',
    marginTop: 5,
  },
});

export default CharacterSelectModal;