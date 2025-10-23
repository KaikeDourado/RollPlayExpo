
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
// Para ícones de dados, você pode usar @expo/vector-icons, por exemplo:
// import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * @function ChatTab
 * @description Componente de aba de chat para a sessão de RPG no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile. Os ícones de dados são substituídos por texto simples
 * para simplificar a migração inicial.
 * @param {string} campaignUid O UID da campanha atual.
 */
const ChatTab = ({ campaignUid }) => {
  // Placeholder para mensagens do chat
  const messages = [
    { id: '1', sender: 'Mestre', content: 'Bem-vindos à sessão de hoje!' },
    { id: '2', sender: 'Jogador 1', content: 'Estou pronto para a aventura!' },
    { id: '3', sender: 'Jogador 2', content: 'Vou rolar um d20 para percepção.' },
  ];

  const handleDiceRoll = (diceType) => {
    Alert.alert('Rolagem de Dado', `Você rolou um ${diceType}. Funcionalidade de rolagem a ser implementada.`);
  };

  const handleSendMessage = () => {
    Alert.alert('Enviar Mensagem', 'Funcionalidade de envio de mensagem a ser implementada.');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View key={message.id} style={styles.messageItem}>
            <Text style={styles.playerName}>{message.sender}:</Text>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.diceButtonsContainer}>
        <DiceButton label="d4" onPress={() => handleDiceRoll('d4')} />
        <DiceButton label="d6" onPress={() => handleDiceRoll('d6')} />
        <DiceButton label="d8" onPress={() => handleDiceRoll('d8')} />
        <DiceButton label="d10" onPress={() => handleDiceRoll('d10')} />
        <DiceButton label="d12" onPress={() => handleDiceRoll('d12')} />
        <DiceButton label="d20" onPress={() => handleDiceRoll('d20')} />
        <DiceButton label="d100" onPress={() => handleDiceRoll('d100')} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DiceButton = ({ label, onPress }) => (
  <TouchableOpacity style={diceButtonStyles.button} onPress={onPress}>
    {/* Em um projeto real, você usaria um ícone aqui, e.g., <MaterialCommunityIcons name="dice-d${label.substring(1)}" size={24} color="#fff" /> */}
    <Text style={diceButtonStyles.icon}>{label}</Text>
    <Text style={diceButtonStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  playerName: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  messageContent: {
    color: '#555',
  },
  diceButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const diceButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 8,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
});

export default ChatTab;

