import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
  const navigation = useNavigation();
  const { id, campaignUid } = route.params;
  
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
      console.log('🔍 Buscando ficha com ID:', id);
      
      const response = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/sheets/${id}`,
        { method: 'GET' }
      );

      console.log('📊 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`Erro ao buscar ficha: ${response.status}`);
      }

      const rawText = await response.text();
      console.log('📥 Resposta RAW (texto):', rawText);
      
      const data = JSON.parse(rawText);
      console.log('✅ Ficha carregada COMPLETA:', JSON.stringify(data, null, 2));
      console.log('🔑 Chaves do objeto data:', Object.keys(data));

      let sheetData;
      
      if (data.data) {
        console.log('📦 API retornou em data.data');
        sheetData = data.data;
      } else if (data.sheet) {
        console.log('📦 API retornou em data.sheet');
        sheetData = data.sheet;
      } else if (data.character) {
        console.log('📦 API retornou em data.character');
        sheetData = data.character;
      } else {
        console.log('📦 API retornou direto (sem wrapper)');
        sheetData = data;
      }
      
      console.log('🎯 Sheet Data FINAL extraído:', sheetData);
      console.log('🔑 Chaves do sheetData:', Object.keys(sheetData || {}));
      
      const normalizedData = {
        ...sheetData,
        hp: sheetData.hp || {
          current: 0,
          max: 0,
          temp: 0,
          hitDice: { type: 'd10', max: 0, spent: 0 }
        },
        deathSaves: sheetData.deathSaves || { successes: 0, failures: 0 },
        attributes: sheetData.attributes || {},
        skills: sheetData.skills || {},
        weapons: sheetData.weapons || [],
        features: sheetData.features || {},
        inventory: sheetData.inventory || { equipment: [], magicItemsAttuned: [], coins: {} },
        spellcasting: sheetData.spellcasting || { hasSpellcasting: false },
        speed: sheetData.speed || { walk: 0, swim: 0, fly: 0, climb: 0, burrow: 0 },
        ac: sheetData.ac || { value: 10, breakdown: {}, shieldEquipped: false }
      };
      
      console.log('✨ Dados normalizados:', normalizedData);
      setCharacterData(normalizedData);
    } catch (err) {
      console.error('❌ Erro ao buscar ficha:', err);
      setError(err.message || 'Não foi possível carregar a ficha.');
      Alert.alert('Erro', 'Não foi possível carregar a ficha do personagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCharacter = (section, data) => {
    console.log(`🔄 Atualizando seção: ${section}`, data);
    
    if (!editMode) {
      console.log('⚠️ Tentativa de atualização fora do modo de edição');
      return;
    }

    setCharacterData(prev => {
      let updated;
      
      switch(section) {
        case 'general':
          updated = { ...prev, ...data };
          break;
        
        case 'personality':
          updated = {
            ...prev,
            appearance: data.appearance !== undefined ? data.appearance : prev.appearance,
            backstoryPersonality: data.backstoryPersonality !== undefined ? data.backstoryPersonality : prev.backstoryPersonality,
            ideals: data.ideals !== undefined ? data.ideals : prev.ideals,
            bonds: data.bonds !== undefined ? data.bonds : prev.bonds,
            flaws: data.flaws !== undefined ? data.flaws : prev.flaws,
          };
          break;
        
        case 'notes':
          updated = { ...prev, notes: data };
          break;
        
        case 'hp':
          updated = { ...prev, hp: data };
          break;
        
        default:
          updated = {
            ...prev,
            [section]: data
          };
      }
      
      console.log('✅ Dados atualizados localmente:', updated);
      return updated;
    });
  };

  const saveToBackend = async () => {
    if (!characterData) return;

    setSaving(true);
    try {
      console.log('💾 Salvando ficha:', characterData);

      const response = await fetchSecure(
        `https://rollplaybackend-d8a5arbvaae7bsej.eastus-01.azurewebsites.net/sheets/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(characterData)
        }
      );

      console.log('📊 Status da resposta de salvamento:', response.status);
      
      const responseText = await response.text();
      console.log('📥 Resposta do servidor:', responseText);
      
      if (!response.ok) {
        console.error('❌ Erro na resposta:', responseText);
        throw new Error(`Erro ao salvar ficha: ${response.status} - ${responseText}`);
      }

      let responseData;
      try {
        if (responseText) {
          responseData = JSON.parse(responseText);
          console.log('✅ Resposta parseada:', responseData);
        }
      } catch (parseError) {
        console.log('⚠️ Resposta não é JSON, mas salvamento foi bem-sucedido');
      }

      console.log('✅ Ficha salva com sucesso!');
      Alert.alert('Sucesso', 'Ficha salva com sucesso!');
      setEditMode(false);
      
    } catch (err) {
      console.error('❌ Erro ao salvar ficha:', err);
      Alert.alert(
        'Erro', 
        `Não foi possível salvar as alterações.\n\nDetalhes: ${err.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      console.log('💾 Saindo do modo de edição - salvando...');
      saveToBackend();
    } else {
      console.log('✏️ Entrando no modo de edição');
      setEditMode(true);
    }
  };

  const handleBack = () => {
    console.log('⬅️ Voltando para ProfileSession com campaignUid:', campaignUid);
    
    if (campaignUid) {
      navigation.navigate('ProfileSession', {
        campaignUid: campaignUid,
        campaignData: null,
      });
    } else {
      navigation.goBack();
    }
  };

  const renderSection = () => {
    if (!characterData) {
      console.log('⚠️ characterData é null, não renderizando seção');
      return null;
    }

    const {
      name, characterClass, subclass, level, race, alignment, background, xp,
      proficiencyBonus, inspirationHeroica, attributes, skills, passivePerception,
      size, speed, initiative, ac, equipmentProficiencies, languages,
      treinamentoEProfEquip, weapons, features, inventory, spellcasting,
      appearance, backstoryPersonality, ideals, bonds, flaws, notes
    } = characterData;

    console.log(`📄 Renderizando seção: ${activeSection}`);

    switch (activeSection) {
      case 'visaoGeral':
        const visaoGeralData = {
          name, race, characterClass, subclass, level, background, alignment, xp,
          inspirationHeroica, passivePerception, size, speed, initiative, ac
        };
        return (
          <VisaoGeralSection
            data={visaoGeralData}
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
        const personalidadeData = { appearance, backstoryPersonality, ideals, bonds, flaws };
        return (
          <PersonalidadeSection
            data={personalidadeData}
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
        pvAtual={characterData.hp?.current || 0}
        pvTotal={characterData.hp?.max || 0}
        pvTemp={characterData.hp?.temp || 0}
        hitDice={characterData.hp?.hitDice || { type: 'd10', max: 0, spent: 0 }}
        deathSaves={characterData.deathSaves || { successes: 0, failures: 0 }}
        editMode={editMode}
        onEditToggle={handleEditToggle}
        onHeal={(value) => {
          console.log(`💚 Curando ${value} HP`);
          if (!characterData.hp) return;
          const newHp = Math.min(characterData.hp.current + value, characterData.hp.max);
          handleUpdateCharacter('hp', { ...characterData.hp, current: newHp });
        }}
        onDamage={(value) => {
          console.log(`💔 Recebendo ${value} de dano`);
          if (!characterData.hp) return;
          const newHp = Math.max(characterData.hp.current - value, 0);
          handleUpdateCharacter('hp', { ...characterData.hp, current: newHp });
        }}
        onBack={handleBack}
      />
      
      <View style={styles.menuContainer}>
        <KeyboardAwareScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.menu}
          contentContainerStyle={styles.menuContent}
          keyboardShouldPersistTaps="handled"
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeSection === item.id && styles.menuItemActive
              ]}
              onPress={() => {
                console.log(`📘 Mudando para seção: ${item.id}`);
                setActiveSection(item.id);
              }}
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
        </KeyboardAwareScrollView>
      </View>

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={Platform.OS === 'ios' ? 130 : 100}
        extraScrollHeight={Platform.OS === 'ios' ? 130 : 100}
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords={false}
      >
        {renderSection()}
      </KeyboardAwareScrollView>

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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
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