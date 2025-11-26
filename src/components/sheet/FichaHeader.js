import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';

const FichaHeader = ({ 
  characterImage, 
  characterName, 
  characterClass, 
  pvAtual, 
  pvTotal, 
  pvTemp, 
  editMode, 
  onEditToggle, 
  onHeal, 
  onDamage 
}) => {
  const [pvInputValue, setPvInputValue] = useState('');

  const handleHeal = () => {
    if (pvInputValue) {
      onHeal(parseInt(pvInputValue, 10));
      setPvInputValue('');
    } else {
      Alert.alert('Erro', 'Por favor, insira um valor para curar.');
    }
  };

  const handleDamage = () => {
    if (pvInputValue) {
      onDamage(parseInt(pvInputValue, 10));
      setPvInputValue('');
    } else {
      Alert.alert('Erro', 'Por favor, insira um valor para causar dano.');
    }
  };

  // Calcula porcentagem de HP para barra de progresso
  const hpPercentage = Math.max(0, Math.min(100, (pvAtual / pvTotal) * 100));
  
  // Define cor da barra baseado na porcentagem
  const getHpColor = () => {
    if (hpPercentage > 50) return '#10b981';
    if (hpPercentage > 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.fichaHeader}>
      {/* Botão de Editar */}
      <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
        <Text style={styles.editButtonText}>{editMode ? '✓ Salvar' : '✎ Editar'}</Text>
      </TouchableOpacity>

      {/* Informações do Personagem */}
      <View style={styles.characterInfo}>
        <View style={styles.portraitContainer}>
          <View style={styles.portraitWrapper}>
            {characterImage ? (
              <Image source={{ uri: characterImage }} style={styles.portraitImage} />
            ) : (
              <View style={styles.portraitPlaceholder}>
                <Text style={styles.portraitIcon}>👤</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.characterDetails}>
          <Text style={styles.characterName}>{characterName}</Text>
          <Text style={styles.characterClass}>{characterClass}</Text>
        </View>
      </View>

      {/* HP Section */}
      <View style={styles.hpSection}>
        <View style={styles.hpHeader}>
          <Text style={styles.hpLabel}>PONTOS DE VIDA</Text>
          <View style={styles.hpValues}>
            <Text style={styles.hpCurrent}>{pvAtual}</Text>
            <Text style={styles.hpSeparator}>/</Text>
            <Text style={styles.hpMax}>{pvTotal}</Text>
          </View>
        </View>

        {/* Barra de HP */}
        <View style={styles.hpBarContainer}>
          <View style={[styles.hpBar, { width: `${hpPercentage}%`, backgroundColor: getHpColor() }]} />
        </View>

        {/* HP Temporário */}
        {pvTemp > 0 && (
          <View style={styles.tempHpContainer}>
            <Text style={styles.tempHpLabel}>PV Temporário:</Text>
            <Text style={styles.tempHpValue}>+{pvTemp}</Text>
          </View>
        )}

        {/* Controles de HP */}
        <View style={styles.hpControls}>
          <TextInput
            style={styles.hpInput}
            keyboardType="numeric"
            placeholder="Valor"
            placeholderTextColor="#6b7280"
            value={pvInputValue}
            onChangeText={setPvInputValue}
          />
          
          <TouchableOpacity style={[styles.hpButton, styles.healButton]} onPress={handleHeal}>
            <Text style={styles.hpButtonText}>+ Curar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.hpButton, styles.damageButton]} onPress={handleDamage}>
            <Text style={styles.hpButtonText}>- Dano</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fichaHeader: {
    backgroundColor: '#1a1f3a',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#3b9dff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  portraitContainer: {
    marginRight: 16,
  },
  portraitWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#3b9dff',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  portraitPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2d3653',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitIcon: {
    fontSize: 40,
    color: '#6b7280',
  },
  characterDetails: {
    flex: 1,
  },
  characterName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  characterClass: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: '500',
  },
  hpSection: {
    backgroundColor: '#0a0e27',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  hpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hpLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
  },
  hpValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hpCurrent: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  hpSeparator: {
    fontSize: 20,
    color: '#6b7280',
    marginHorizontal: 4,
  },
  hpMax: {
    fontSize: 20,
    fontWeight: '600',
    color: '#9ca3af',
  },
  hpBarContainer: {
    height: 8,
    backgroundColor: '#2d3653',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  hpBar: {
    height: '100%',
    borderRadius: 4,
  },
  tempHpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    marginBottom: 12,
  },
  tempHpLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginRight: 8,
  },
  tempHpValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b9dff',
  },
  hpControls: {
    flexDirection: 'row',
    gap: 8,
  },
  hpInput: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderWidth: 1.5,
    borderColor: '#2d3653',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  hpButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healButton: {
    backgroundColor: '#10b981',
  },
  damageButton: {
    backgroundColor: '#ef4444',
  },
  hpButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default FichaHeader;