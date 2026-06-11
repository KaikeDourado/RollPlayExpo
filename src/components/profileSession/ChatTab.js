import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { fetchSecure } from '../../lib/fetchSecure';
import { authApi } from '../../lib/auth';
const API_BASE_URL = 'https://rollplayapi-fbb4e7a9hqa3ehds.eastus-01.azurewebsites.net';

const DiceButton = ({ label, onPress }) => (
  <TouchableOpacity style={diceButtonStyles.button} onPress={onPress} activeOpacity={0.7}>
    <View style={diceButtonStyles.iconContainer}>
      <Text style={diceButtonStyles.icon}>🎲</Text>
    </View>
    <Text style={diceButtonStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const ChatTab = ({ campaignUid }) => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
    fetchMessages();
  }, [campaignUid]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetchSecure(
        `${API_BASE_URL}/campaigns/${campaignUid}/chat`,
        { method: 'GET' }
      );

      if (!response.ok) {
        console.error('Erro ao buscar mensagens:', response.status);
        return;
      }

      const data = await response.json();
      // espera que a API retorne { messages: [...] }
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiceRoll = async (diceType) => {
    if (!currentUser) return;

    // "d6" -> 6
    const numSides = parseInt(diceType.substring(1), 10);
    const numDice = 1;

    try {
      const response = await fetchSecure(
        `${API_BASE_URL}/dice/roll`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            numDice,
            numSides,
          }),
        }
      );

      if (!response.ok) {
        console.error('Erro ao rolar dados:', response.status);
        return;
      }

      const { rolls, total } = await response.json();

      // mensagem simples, sem frescura
      const diceMessage = `🎲 ${currentUser.displayName || 'Jogador'} rolou ${numDice}d${numSides}: [${rolls.join(', ')}] (total: ${total})`;

      await sendMessage(diceMessage, 'dice');
    } catch (err) {
      console.error('Erro ao rolar dados:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    await sendMessage(messageText.trim(), 'text');
    setMessageText('');
  };

  const sendMessage = async (content, type = 'text') => {
    if (!currentUser) return;

    setSending(true);
    try {
      const messageData = {
        content,
        type,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Jogador',
        campaignId: campaignUid,
        timestamp: new Date().toISOString(),
      };

      const response = await fetchSecure(
        `${API_BASE_URL}/campaigns/${campaignUid}/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        console.error('Erro ao enviar mensagem:', response.status);
        return;
      }

      const newMessage = await response.json();

      // adiciona a mensagem nova na lista atual
      setMessages(prev => [...prev, newMessage]);

      // scroll pro final
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = (message, index) => {
    const isCurrentUser = message.senderId === currentUser?.uid;
    const isMaster = message.senderRole === 'master' || message.sender === 'Mestre';
    const isDiceRoll = message.type === 'dice';

    if (isDiceRoll) {
      return (
        <View key={message.id || message._id || message.uid || `message-${index}`} style={styles.diceMessageContainer}>
          <View style={styles.diceMessageBubble}>
            <Text style={styles.diceMessageSender}>{message.senderName}</Text>
            <Text style={styles.diceMessageContent}>{message.content}</Text>
          </View>
        </View>
      );
    }

    return (
      <View
        key={message.id || message._id || message.uid || `message-${index}`}
        style={[
          styles.messageContainer,
          isCurrentUser && styles.messageContainerRight
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isCurrentUser && styles.messageBubbleRight,
            isMaster && styles.messageBubbleMaster
          ]}
        >
          {!isCurrentUser && (
            <Text style={[
              styles.senderName,
              isMaster && styles.senderNameMaster
            ]}>
              {isMaster ? '👑 ' : ''}{message.senderName || message.sender}
            </Text>
          )}
          <Text style={[
            styles.messageContent,
            isCurrentUser && styles.messageContentRight,
            isMaster && styles.messageContentMaster
          ]}>
            {message.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser && styles.messageTimeRight
          ]}>
            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : ''}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => renderMessage(message, index))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💬</Text>
            <Text style={styles.emptyStateText}>Nenhuma mensagem ainda</Text>
            <Text style={styles.emptyStateSubtext}>Seja o primeiro a enviar uma mensagem!</Text>
          </View>
        )}
      </ScrollView>

      {/* Dice Buttons */}
      <View style={styles.diceSection}>
        <Text style={styles.diceSectionTitle}>🎲 Rolar Dados</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.diceButtonsContainer}
        >
          <DiceButton label="d4" onPress={() => handleDiceRoll('d4')} />
          <DiceButton label="d6" onPress={() => handleDiceRoll('d6')} />
          <DiceButton label="d8" onPress={() => handleDiceRoll('d8')} />
          <DiceButton label="d10" onPress={() => handleDiceRoll('d10')} />
          <DiceButton label="d12" onPress={() => handleDiceRoll('d12')} />
          <DiceButton label="d20" onPress={() => handleDiceRoll('d20')} />
          <DiceButton label="d100" onPress={() => handleDiceRoll('d100')} />
        </ScrollView>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#6b7280"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={sending || !messageText.trim()}
          activeOpacity={0.7}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.sendButtonText}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  messageContainer: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  messageContainerRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  messageBubbleRight: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  messageBubbleMaster: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b9dff',
    marginBottom: 4,
  },
  senderNameMaster: {
    color: '#fbbf24',
  },
  messageContent: {
    fontSize: 15,
    color: '#e5e7eb',
    lineHeight: 20,
  },
  messageContentRight: {
    color: '#ffffff',
  },
  messageContentMaster: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeRight: {
    color: '#e0e7ff',
  },
  diceMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  diceMessageBubble: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 10,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#3b9dff',
    borderStyle: 'dashed',
  },
  diceMessageSender: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b9dff',
    textAlign: 'center',
    marginBottom: 2,
  },
  diceMessageContent: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    fontWeight: '600',
  },
  diceSection: {
    backgroundColor: '#1a1f3a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2d3653',
  },
  diceSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  diceButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#1a1f3a',
    borderTopWidth: 1,
    borderTopColor: '#2d3653',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#0a0e27',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#ffffff',
    maxHeight: 100,
    fontWeight: '500',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b9dff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b9dff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '700',
  },
});

const diceButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    borderWidth: 1.5,
    borderColor: '#2d3653',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#3b9dff',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 13,
    color: '#3b9dff',
    fontWeight: '700',
  },
});

export default ChatTab;