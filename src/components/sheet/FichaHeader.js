import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';

const FichaHeader = ({ 
  characterImage, 
  characterName, 
  characterClass, 
  pvAtual, 
  pvTotal, 
  pvTemp,
  hitDice,
  deathSaves,
  editMode, 
  onEditToggle, 
  onHeal, 
  onDamage,
  onBack
}) => {
  const [pvInputValue, setPvInputValue] = useState('');
  const [showDeathSaves, setShowDeathSaves] = useState(false);

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

  // Verifica se o personagem está em 0 HP
  const isDying = pvAtual <= 0;

  return (
    <View style={styles.fichaHeader}>
      {/* Header com botões */}
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={onEditToggle}>
          <Text style={styles.editButtonText}>{editMode ? '✓ Salvar' : '✎ Editar'}</Text>
        </TouchableOpacity>
      </View>

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

        {/* Dados de Vida */}
        {hitDice && (
          <View style={styles.hitDiceContainer}>
            <Text style={styles.hitDiceLabel}>Dados de Vida</Text>
            <View style={styles.hitDiceInfo}>
              <Text style={styles.hitDiceValue}>
                {hitDice.max - hitDice.spent}/{hitDice.max}
              </Text>
              <Text style={styles.hitDiceType}>{hitDice.type}</Text>
            </View>
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

        {/* Testes de Morte (aparece quando HP = 0) */}
        {isDying && deathSaves && (
          <View style={styles.deathSavesContainer}>
            <Text style={styles.deathSavesTitle}>⚠️ Testes de Morte</Text>
            <View style={styles.deathSavesRow}>
              <View style={styles.deathSavesSection}>
                <Text style={styles.deathSavesLabel}>Sucessos</Text>
                <View style={styles.deathSavesBoxes}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={`success-${i}`}
                      style={[
                        styles.deathSaveBox,
                        i <= deathSaves.successes && styles.deathSaveBoxSuccess
                      ]}
                    >
                      {i <= deathSaves.successes && <Text style={styles.deathSaveCheck}>✓</Text>}
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.deathSavesSection}>
                <Text style={styles.deathSavesLabel}>Falhas</Text>
                <View style={styles.deathSavesBoxes}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={`failure-${i}`}
                      style={[
                        styles.deathSaveBox,
                        i <= deathSaves.failures && styles.deathSaveBoxFailure
                      ]}
                    >
                      {i <= deathSaves.failures && <Text style={styles.deathSaveCheck}>✕</Text>}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fichaHeader: {
    backgroundColor: '#1a1f3a',
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 14,
  },
  backButton: {
    backgroundColor: '#2d3653',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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
  hitDiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1a1f3a',
    borderRadius: 8,
    marginBottom: 12,
  },
  hitDiceLabel: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  hitDiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hitDiceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b9dff',
  },
  hitDiceType: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  deathSavesContainer: {
    backgroundColor: '#2d1f1f',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  deathSavesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  deathSavesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  deathSavesSection: {
    alignItems: 'center',
  },
  deathSavesLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 6,
    fontWeight: '600',
  },
  deathSavesBoxes: {
    flexDirection: 'row',
    gap: 6,
  },
  deathSaveBox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2d3653',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1f3a',
  },
  deathSaveBoxSuccess: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  deathSaveBoxFailure: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  deathSaveCheck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FichaHeader;