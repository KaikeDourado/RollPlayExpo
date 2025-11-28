import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { fetchSecure } from '../lib/fetchSecure';

// Importar componentes
import FichaHeader from '../components/sheet/FichaHeader';
import VisaoGeralSection from '../components/sheet/VisaoGeralSection';
import AtributosSection from '../components/sheet/AtributosSection';
import PericiasProficienciasSection from '../components/sheet/PericiasProficienciasSection';
import AtaquesMagiasSection from '../components/sheet/AtaquesMagiasSection';
import InventarioSection from '../components/sheet/InventarioSection';
import HabilidadesSection from '../components/sheet/HabilidadesSection';
import PersonalidadeSection from '../components/sheet/PersonalidadeSection';
import AnotacoesSection from '../components/sheet/AnotacoesSection';

const SheetPage = () => {
  const route = useRoute();
  const { id } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const [activeSection, setActiveSection] = useState('visaoGeral');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCharacterData();
  }, [id]);

  const fetchCharacterData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Buscando ficha com ID:', id);
      
      const response = await fetchSecure(
        `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/sheets/${id}`,
        { method: 'GET' }
      );

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`Erro ao buscar ficha: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ficha carregada:', data);

      // Se a API retorna { success: true, data: {...} }
      const sheetData = data.data || data;
      
      setCharacterData(sheetData);
    } catch (err) {
      console.error('Erro ao buscar ficha:', err);
      setError(err.message || 'Não foi possível carregar a ficha.');
      Alert.alert('Erro', 'Não foi possível carregar a ficha do personagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCharacter = (section, data) => {
    if (!editMode) return;

    // Atualiza localmente primeiro (otimista)
    setCharacterData(prev => {
      if (section === 'general') {
        return { ...prev, ...data };
      }
      return {
        ...prev,
        [section]: data
      };
    });
  };

  const saveToBackend = async () => {
    if (!characterData) return;

    setSaving(true);
    try {
      console.log('Salvando ficha:', characterData);

      const response = await fetchSecure(
        `https://rollplaymonolith-e8ezdadmajfvb5fu.eastus-01.azurewebsites.net/sheets/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(characterData)
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao salvar ficha');
      }

      Alert.alert('Sucesso', 'Ficha salva com sucesso!');
      setEditMode(false);
    } catch (err) {
      console.error('Erro ao salvar ficha:', err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Salvando ao sair do modo de edição
      saveToBackend();
    } else {
      setEditMode(true);
    }
  };

  const renderSection = () => {
    if (!characterData) return null;

    const {
      name, characterClass, subclass, level, race, alignment, background, xp,
      proficiencyBonus, inspirationHeroica, attributes, skills, passivePerception,
      size, speed, initiative, ac, equipmentProficiencies, languages,
      treinamentoEProfEquip, weapons, features, inventory, spellcasting,
      appearance, backstoryPersonality, ideals, bonds, flaws, notes
    } = characterData;

    switch (activeSection) {
      case 'visaoGeral':
        return (
          <VisaoGeralSection
            data={{
              name, race, characterClass, subclass, level, background, alignment, xp,
              inspirationHeroica, passivePerception, size, speed, initiative, ac
            }}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('general', data)}
          />
        );
      case 'atributos':
        return (
          <AtributosSection
            attributes={attributes}
            proficiencyBonus={proficiencyBonus}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('attributes', data)}
          />
        );
      case 'pericias':
        return (
          <PericiasProficienciasSection
            skills={skills}
            proficiencyBonus={proficiencyBonus}
            equipmentProficiencies={equipmentProficiencies}
            languages={languages}
            treinamentoEProfEquip={treinamentoEProfEquip}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('skills', data)}
          />
        );
      case 'ataques':
        return (
          <AtaquesMagiasSection
            weapons={weapons}
            spellcasting={spellcasting}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('combat', data)}
          />
        );
      case 'inventario':
        return (
          <InventarioSection
            inventory={inventory}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('inventory', data)}
          />
        );
      case 'habilidades':
        return (
          <HabilidadesSection
            features={features}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('features', data)}
          />
        );
      case 'personalidade':
        return (
          <PersonalidadeSection
            data={{ appearance, backstoryPersonality, ideals, bonds, flaws }}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('personality', data)}
          />
        );
      case 'anotacoes':
        return (
          <AnotacoesSection
            notes={notes}
            editMode={editMode}
            onSave={(data) => handleUpdateCharacter('notes', data)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b9dff" />
        <Text style={styles.loadingText}>Carregando ficha...</Text>
      </View>
    );
  }

  if (error || !characterData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>
          {error || 'Não foi possível carregar a ficha'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCharacterData}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    { id: 'visaoGeral', label: 'Visão Geral', icon: '📋' },
    { id: 'atributos', label: 'Atributos', icon: '💪' },
    { id: 'pericias', label: 'Perícias', icon: '🎯' },
    { id: 'ataques', label: 'Ataques', icon: '⚔️' },
    { id: 'inventario', label: 'Inventário', icon: '🎒' },
    { id: 'habilidades', label: 'Habilidades', icon: '✨' },
    { id: 'personalidade', label: 'Personalidade', icon: '🎭' },
    { id: 'anotacoes', label: 'Anotações', icon: '📝' },
  ];

  return (
    <View style={styles.container}>
      <FichaHeader
        characterImage={characterData.characterImage}
        characterName={characterData.name}
        characterClass={`${characterData.characterClass} (${characterData.subclass}) - Nível ${characterData.level}`}
        pvAtual={characterData.hp.current}
        pvTotal={characterData.hp.max}
        pvTemp={characterData.hp.temp}
        hitDice={characterData.hp.hitDice}
        deathSaves={characterData.deathSaves}
        editMode={editMode}
        onEditToggle={handleEditToggle}
        onHeal={(value) => {
          const newHp = Math.min(characterData.hp.current + value, characterData.hp.max);
          handleUpdateCharacter('hp', { ...characterData.hp, current: newHp });
        }}
        onDamage={(value) => {
          const newHp = Math.max(characterData.hp.current - value, 0);
          handleUpdateCharacter('hp', { ...characterData.hp, current: newHp });
        }}
      />

      <View style={styles.menuContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.menu}
          contentContainerStyle={styles.menuContent}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeSection === item.id && styles.menuItemActive
              ]}
              onPress={() => setActiveSection(item.id)}
            >
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.menuItemText,
                  activeSection === item.id && styles.menuItemTextActive
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection()}
      </ScrollView>

      {/* Indicador de Salvamento */}
      {saving && (
        <View style={styles.savingOverlay}>
          <View style={styles.savingContainer}>
            <ActivityIndicator size="large" color="#3b9dff" />
            <Text style={styles.savingText}>Salvando...</Text>
          </View>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3b9dff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  menuContainer: {
    backgroundColor: '#1a1f3a',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3653',
  },
  menu: {
    flexDirection: 'row',
  },
  menuContent: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  menuItemActive: {
    backgroundColor: '#3b9dff',
    borderColor: '#3b9dff',
  },
  menuItemIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  menuItemText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  menuItemTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingContainer: {
    backgroundColor: '#1a1f3a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3653',
  },
  savingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SheetPage;