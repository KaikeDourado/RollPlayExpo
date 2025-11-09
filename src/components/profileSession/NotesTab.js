import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

/**
 * @function NotesTab
 * @description Componente de aba para exibir e gerenciar notas de campanha no aplicativo React Native.
 * Adaptado do projeto React original, convertendo elementos HTML para componentes React Native
 * e ajustando o estilo para mobile. A lógica de backend para buscar e salvar notas é removida.
 */
const NotesTab = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Reunião com o Rei', content: 'Discutir a ameaça dos goblins na Floresta Negra.' },
    { id: 2, title: 'Pistas na Taverna', content: 'O taverneiro mencionou um mapa antigo escondido na adega.' },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteTitle.trim() === '' || newNoteContent.trim() === '') {
      Alert.alert('Erro', 'Título e conteúdo da nota não podem estar vazios.');
      return;
    }
    const newNote = {
      id: notes.length + 1,
      title: newNoteTitle,
      content: newNoteContent,
    };
    setNotes([...notes, newNote]);
    setNewNoteTitle('');
    setNewNoteContent('');
    Alert.alert('Sucesso', 'Nota adicionada!');
  };

  const handleDeleteNote = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta nota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => setNotes(notes.filter(note => note.id !== id)) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NOTAS DA CAMPANHA</Text>
      </View>

      <ScrollView style={styles.notesList}>
        {notes.length > 0 ? (
          notes.map(note => (
            <View key={note.id} style={styles.noteItem}>
              <View style={styles.noteContentContainer}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteText}>{note.content}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noNotesText}>Nenhuma nota adicionada ainda.</Text>
        )}
      </ScrollView>

      <View style={styles.addNoteContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título da nova nota"
          value={newNoteTitle}
          onChangeText={setNewNoteTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Conteúdo da nova nota"
          multiline
          numberOfLines={4}
          value={newNoteContent}
          onChangeText={setNewNoteContent}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Text style={styles.addButtonText}>Adicionar Nota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesList: {
    flex: 1,
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  noteContentContainer: {
    flex: 1,
    marginRight: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noNotesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  addNoteContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotesTab;

