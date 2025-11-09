
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';

/**
 * @function FichaHeader
 * @description Cabeçalho da ficha de personagem, com informações básicas e controle de PV.
 * Adaptado do projeto React original para React Native.
 * @param {string} characterImage - URL da imagem do personagem. (Não implementado no JSON)
 * @param {string} characterName - Nome do personagem.
 * @param {string} characterClass - Classe do personagem.
 * @param {number} pvAtual - Pontos de Vida atuais.
 * @param {number} pvTotal - Pontos de Vida totais.
 * @param {number} pvTemp - Pontos de Vida temporários.
 * @param {function} onEditToggle - Função para alternar o modo de edição.
 * @param {boolean} editMode - Indica se a ficha está em modo de edição.
 * @param {function} onHeal - Função para curar PV. (A ser implementada no SheetPage)
 * @param {function} onDamage - Função para causar dano. (A ser implementada no SheetPage)
 */
const FichaHeader = ({ characterImage, characterName, characterClass, pvAtual, pvTotal, pvTemp, editMode, onEditToggle, onHeal, onDamage }) => {
  // Funções onHeal e onDamage não foram passadas pelo SheetPage, mas mantemos a estrutura para futura implementação.
  // Por enquanto, apenas simulamos a lógica de PV no SheetPage.
  const onHealProp = onHeal || (() => console.log('onHeal não implementado'));
  const onDamageProp = onDamage || (() => console.log('onDamage não implementado'));
  const [pvInputValue, setPvInputValue] = useState('');

  const handleHeal = () => {
    if (pvInputValue) {
      onHealProp(parseInt(pvInputValue, 10));
      setPvInputValue('');
    } else {
      Alert.alert('Erro', 'Por favor, insira um valor para curar.');
    }
  };

  const handleDamage = () => {
    if (pvInputValue) {
      onDamageProp(parseInt(pvInputValue, 10));
      setPvInputValue('');
    } else {
      Alert.alert('Erro', 'Por favor, insira um valor para causar dano.');
    }
  };

  return (
    <View style={styles.fichaHeader}>
      {/* Botão de Editar Ficha no canto superior direito */}
      <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
        <Text style={styles.editButtonText}>{editMode ? 'Salvar' : 'Editar'}</Text>
      </TouchableOpacity>

      <View style={styles.fichaTitle}>
        <View style={styles.characterPortrait}>
          <View style={styles.portraitPlaceholder}>
            {characterImage ? (
              <Image source={{ uri: characterImage }} style={styles.portraitImage} />
            ) : (
              <Text style={styles.portraitIcon}>👤</Text>
            )}
          </View>
          {editMode && (
            <TouchableOpacity style={styles.uploadPortraitBtn} onPress={() => Alert.alert('Upload', 'Funcionalidade de upload de imagem a ser implementada.')}>
              <Text style={styles.uploadPortraitBtnText}>Alterar Imagem</Text>
            </TouchableOpacity>
          )}
        </View>
        <View>
          <Text style={styles.characterName}>{characterName}</Text>
          <Text style={styles.characterClass}>{characterClass}</Text>
        </View>
      </View>

      {/* Bloco de Pontos de Vida */}
      <View style={styles.pvBlock}>
        {/* Coluna esquerda: Botões e input */}
        <View style={styles.pvControls}>
          <TouchableOpacity style={[styles.pvButton, styles.healButton]} onPress={handleHeal}>
            <Text style={styles.pvButtonText}>Curar</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.pvInput}
            keyboardType="numeric"
            placeholder="Valor"
            value={pvInputValue}
            onChangeText={setPvInputValue}
          />
          <TouchableOpacity style={[styles.pvButton, styles.damageButton]} onPress={handleDamage}>
            <Text style={styles.pvButtonText}>Dano</Text>
          </TouchableOpacity>
        </View>

        {/* Coluna direita: PV Atual, PV Total e PV Temporário */}
        <View style={styles.pvValues}>
          <View style={styles.pvItem}>
            <Text style={styles.pvLabel}>PV Atual: </Text>
            <Text style={styles.pvValue}>{pvAtual}</Text>
          </View>
          <View style={styles.pvItem}>
            <Text style={styles.pvLabel}>PV Total: </Text>
            <Text style={styles.pvValue}>{pvTotal}</Text>
          </View>
          <View style={styles.pvItem}>
            <Text style={styles.pvLabel}>PV Temporário: </Text>
            <Text style={styles.pvValue}>{pvTemp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fichaHeader: {
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#555',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  fichaTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterPortrait: {
    marginRight: 15,
    alignItems: 'center',
  },
  portraitPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  portraitIcon: {
    fontSize: 40,
    color: '#ccc',
  },
  uploadPortraitBtn: {
    marginTop: 5,
    backgroundColor: '#777',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  uploadPortraitBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  characterClass: {
    fontSize: 16,
    color: '#ccc',
  },
  pvBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 8,
  },
  pvControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pvButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  healButton: {
    backgroundColor: '#28a745',
  },
  damageButton: {
    backgroundColor: '#dc3545',
  },
  pvButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pvInput: {
    backgroundColor: '#fff',
    width: 60,
    height: 35,
    borderRadius: 5,
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 16,
  },
  pvValues: {
    alignItems: 'flex-end',
  },
  pvItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  pvLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  pvValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FichaHeader;

