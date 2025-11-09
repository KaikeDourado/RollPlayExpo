import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

// Importar componentes
import FichaHeader from '../components/sheet/FichaHeader';
import VisaoGeralSection from '../components/sheet/VisaoGeralSection';
import AtributosSection from '../components/sheet/AtributosSection';
import PericiasProficienciasSection from '../components/sheet/PericiasProficienciasSection'; // Adicionado
import AtaquesMagiasSection from '../components/sheet/AtaquesMagiasSection';
import InventarioSection from '../components/sheet/InventarioSection';
import HabilidadesSection from '../components/sheet/HabilidadesSection';
import PersonalidadeSection from '../components/sheet/PersonalidadeSection';
import AnotacoesSection from '../components/sheet/AnotacoesSection';

// Estrutura completa do JSON fornecida pelo usuário
const initialCharacterData = {
  "userUid": "Ss52b0C44TgyrsMAwyjMaq7uMfi2",
  "campaignUid": "1762008485571",
  "name": "Arden Vale",
  "characterClass": "Guerreiro",
  "subclass": "Campeão",
  "level": 5,
  "race": "Humano",
  "species": "Humano",
  "alignment": "Neutro Bom",
  "background": "Soldado",
  "xp": 6500,

  "proficiencyBonus": 3,
  "inspirationHeroica": false,

  "attributes": {
    "str": { "score": 16, "mod": 3, "saveProficient": true, "saveBonus": 6 },
    "dex": { "score": 14, "mod": 2, "saveProficient": false, "saveBonus": 2 },
    "con": { "score": 15, "mod": 2, "saveProficient": true, "saveBonus": 5 },
    "int": { "score": 10, "mod": 0, "saveProficient": false, "saveBonus": 0 },
    "wis": { "score": 12, "mod": 1, "saveProficient": false, "saveBonus": 1 },
    "cha": { "score": 10, "mod": 0, "saveProficient": false, "saveBonus": 0 }
  },

  "skills": {
    "athletics": { "ability": "str", "proficient": true, "bonus": 6 },
    "acrobatics": { "ability": "dex", "proficient": false, "bonus": 2 },
    "sleightOfHand": { "ability": "dex", "proficient": false, "bonus": 2 },
    "stealth": { "ability": "dex", "proficient": true, "bonus": 5 },
    "arcana": { "ability": "int", "proficient": false, "bonus": 0 },
    "history": { "ability": "int", "proficient": false, "bonus": 0 },
    "investigation": { "ability": "int", "proficient": false, "bonus": 0 },
    "nature": { "ability": "int", "proficient": false, "bonus": 0 },
    "religion": { "ability": "int", "proficient": false, "bonus": 0 },
    "animalHandling": { "ability": "wis", "proficient": false, "bonus": 1 },
    "insight": { "ability": "wis", "proficient": true, "bonus": 4 },
    "medicine": { "ability": "wis", "proficient": false, "bonus": 1 },
    "perception": { "ability": "wis", "proficient": true, "bonus": 4 },
    "survival": { "ability": "wis", "proficient": false, "bonus": 1 },
    "deception": { "ability": "cha", "proficient": false, "bonus": 0 },
    "intimidation": { "ability": "cha", "proficient": true, "bonus": 3 },
    "performance": { "ability": "cha", "proficient": false, "bonus": 0 },
    "persuasion": { "ability": "cha", "proficient": false, "bonus": 0 }
  },

  "passivePerception": 14,
  "size": "Médio",
  "speed": { "walk": 9, "swim": 0, "fly": 0, "climb": 0, "burrow": 0 },
  "initiative": 2,

  "ac": {
    "value": 18,
    "breakdown": { "base": 10, "dex": 2, "armor": 6, "shield": 0, "misc": 0 },
    "shieldEquipped": false
  },

  "hp": {
    "current": 41,
    "max": 49,
    "temp": 0,
    "hitDice": { "type": "d10", "max": 5, "spent": 2 }
  },

  "deathSaves": { "successes": 0, "failures": 0 },

  "equipmentProficiencies": {
    "armor": { "light": true, "medium": true, "heavy": true, "shields": true },
    "weapons": { "simple": true, "martial": true },
    "tools": ["Kit de Jogo (dados)", "Veículos Terrestres"]
  },

  "languages": ["Comum", "Élfico"],

  "treinamentoEProfEquip": {
    "armadura": ["Leve", "Média", "Pesada", "Escudos"],
    "armas": ["Simples", "Marciais"],
    "ferramentas": ["Kit de Jogo (dados)", "Veículos Terrestres"]
  },

  "weapons": [
    {
      "name": "Espada Longa",
      "bonusOrDC": "+6",
      "damageType": "1d8 + 3 cortante (1d10 + 3 com duas mãos)",
      "notes": "Versátil"
    },
    {
      "name": "Azagaia",
      "bonusOrDC": "+5",
      "damageType": "1d6 + 2 perfurante (alcance 9m)",
      "notes": "Arremesso"
    }
  ],

  "features": {
    "classFeatures": [
      "Estilo de Luta (Defesa)",
      "Surto de Ação (1/Descanso)",
      "Segundo Fôlego (1/Descanso)",
      "Campeão: Crítico Aprimorado (19–20)"
    ],
    "speciesTraits": [
      "Talento Versátil (Humano)",
      "Idiomas Adicionais"
    ],
    "feats": ["Sentinela"]
  },

  "inventory": {
    "equipment": [
      { "name": "Cota de Malha", "qty": 1, "weight": 27.5, "notes": "" },
      { "name": "Pacote de Aventureiro", "qty": 1, "weight": 9.0, "notes": "" },
      { "name": "Corda de Cânhamo (15m)", "qty": 1, "weight": 4.5, "notes": "" }
    ],
    "magicItemsAttuned": [
      { "name": "Anel de Proteção", "attuned": true },
      { "name": "Botas da Furtividade", "attuned": true }
    ],
    "coins": { "cp": 12, "sp": 8, "ep": 0, "gp": 45, "pp": 1 }
  },

  "spellcasting": {
    "hasSpellcasting": false,
    "spellcastingAbility": null,
    "spellSaveDC": null,
    "spellAttackBonus": null,
    "spellcastingMod": null,
    "preparedCount": null,
    "cantrips": [],
    "spellsByLevel": {
      "0": {
        "slots": { "total": 0, "expended": 0 },
        "spells": []
      },
      "1": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "2": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "3": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "4": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "5": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "6": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "7": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "8": { "slots": { "total": 0, "expended": 0 }, "spells": [] },
      "9": { "slots": { "total": 0, "expended": 0 }, "spells": [] }
    },
    "spellNotes": ""
  },

  "appearance": "Homem humano de 1,78 m, cabelo castanho curto, cicatriz discreta na sobrancelha, capa gasta.",
  "backstoryPersonality": "Ex-soldado disciplinado, protege os fracos, impaciente com injustiça.",
  "ideals": "Honra e dever.",
  "bonds": "Prometeu proteger o vilarejo natal.",
  "flaws": "Teimoso e desconfiado de magia.",
  "notes": "Anotar aqui quaisquer condições, inspiração, etc.",

  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2025-11-01T10:00:00.000Z"
};

const SheetPage = () => {
  const route = useRoute();
  const { id } = route.params;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState(null);
  const [activeSection, setActiveSection] = useState('visaoGeral');

  useEffect(() => {
    setTimeout(() => {
      setCharacterData(initialCharacterData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleUpdateCharacter = (section, data) => {
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

  if (loading || !characterData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
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
        characterImage={characterData.characterImage} // opcional
        characterName={characterData.name}
        characterClass={`${characterData.characterClass} (${characterData.subclass}) - Nível ${characterData.level}`}
        pvAtual={characterData.hp.current}
        pvTotal={characterData.hp.max}
        pvTemp={characterData.hp.temp}
        editMode={editMode}
        onEditToggle={() => setEditMode(!editMode)}
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

      <ScrollView style={styles.content}>
        {renderSection()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menu: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  menuItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  menuItemActive: {
    backgroundColor: '#3b82f6',
  },
  menuItemIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  menuItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default SheetPage;
