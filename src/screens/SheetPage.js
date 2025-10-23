
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

// Importar os componentes da ficha (serão criados/adaptados posteriormente)
import FichaHeader from '../components/sheet/FichaHeader';
import VisaoGeralSection from '../components/sheet/VisaoGeralSection';
import AtributosSection from '../components/sheet/AtributosSection';
import PericiasProficienciasSection from '../components/sheet/PericiasProficienciasSection';
import AtaquesMagiasSection from '../components/sheet/AtaquesMagiasSection';
import InventarioSection from '../components/sheet/InventarioSection';
import HabilidadesSection from '../components/sheet/HabilidadesSection';
import PersonalidadeSection from '../components/sheet/PersonalidadeSection';
import AnotacoesSection from '../components/sheet/AnotacoesSection';

/**
 * @function SheetPage
 * @description Tela da Ficha de Personagem no aplicativo React Native.
 * Adaptada do projeto React original, convertendo elementos HTML para componentes React Native,
 * removendo a lógica de backend (axios, localStorage/sessionStorage) e adaptando a navegação.
 * As seções da ficha (VisaoGeralSection, AtributosSection, etc.) são placeholders e precisarão
 * ser migradas individualmente.
 */
const SheetPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Obtém o ID do personagem dos parâmetros da rota

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de dados do personagem
    // Em um cenário real, você faria chamadas de API aqui usando o ID do personagem
    setTimeout(() => {
      if (id) {
        setCharacterData({
          id: id,
          nome: 'Personagem de Teste',
          raca: 'Elfo',
          classe: 'Guerreiro',
          nivel: 5,
          pvAtual: 80,
          pvTotal: 100,
          pvTemp: 10,
          // Dados simulados para as seções
          visaoGeral: { /* ... */ },
          atributos: { /* ... */ },
          pericias: { /* ... */ },
          ataques: [],
          magias: [],
          inventario: [],
          habilidades: [],
          personalidade: { /* ... */ },
          anotacoes: [],
        });
        setLoading(false);
      } else {
        Alert.alert('Erro', 'ID do personagem não fornecido.');
        setLoading(false);
      }
    }, 1500);
  }, [id]);

  const handleEditToggle = () => {
    if (editMode) {
      // Aqui você adicionaria a lógica para salvar no backend, se houvesse
      Alert.alert('Salvar', 'Funcionalidade de salvar no backend a ser implementada.');
    }
    setEditMode(!editMode);
  };

  const handleLocalUpdate = (updatedData) => {
    setCharacterData((prev) => ({ ...prev, ...updatedData }));
  };

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: '📋' },
    { id: 'atributos', label: 'Atributos', icon: '💪' },
    { id: 'pericias', label: 'Perícias', icon: '🎯' },
    { id: 'ataques-magias', label: 'Ataques & Magias', icon: '⚔️' },
    { id: 'inventario', label: 'Inventário', icon: '🎒' },
    { id: 'habilidades', label: 'Habilidades', icon: '✨' },
    { id: 'personalidade', label: 'Traços & Origem', icon: '🎭' },
    { id: 'anotacoes', label: 'Anotações', icon: '📝' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Carregando ficha...</Text>
      </View>
    );
  }

  if (!characterData) {
    return <Text style={styles.errorText}>Ficha não encontrada.</Text>;
  }

  const currentTabComponent = () => {
    switch (activeTab) {
      case 'visao-geral':
        return <VisaoGeralSection data={characterData} editMode={editMode} onSave={handleLocalUpdate} />;
      case 'atributos':
        return <AtributosSection atributos={characterData.atributos} pericias={characterData.pericias} nivel={characterData.nivel} editMode={editMode} onSaveAtributos={(atributos) => handleLocalUpdate({ atributos })} onSavePericias={(pericias) => handleLocalUpdate({ pericias })} />;
      case 'pericias':
        return <PericiasProficienciasSection pericias={characterData.pericias} atributos={characterData.atributos} nivel={characterData.nivel} editMode={editMode} onSave={(pericias) => handleLocalUpdate({ pericias })} />;
      case 'ataques-magias':
        return <AtaquesMagiasSection ataques={characterData.ataques} magias={characterData.magias} editMode={editMode} onSave={(data) => handleLocalUpdate(data)} />;
      case 'inventario':
        return <InventarioSection inventario={characterData.inventario} editMode={editMode} onSave={(inventario) => handleLocalUpdate({ inventario })} />;
      case 'habilidades':
        return <HabilidadesSection habilidades={characterData.habilidades} editMode={editMode} onSave={(habilidades) => handleLocalUpdate({ habilidades })} />;
      case 'personalidade':
        return <PersonalidadeSection personalidade={characterData.personalidade} editMode={editMode} onSave={(personalidade) => handleLocalUpdate({ personalidade })} />;
      case 'anotacoes':
        return <AnotacoesSection anotacoes={characterData.anotacoes} editMode={editMode} onSave={(anotacoes) => handleLocalUpdate({ anotacoes })} />;
      default:
        return <VisaoGeralSection data={characterData} editMode={editMode} onSave={handleLocalUpdate} />;
    }
  };

  return (
    <View style={styles.container}>
      <FichaHeader
        characterName={characterData.nome}
        characterClass={`${characterData.raca} ${characterData.classe} Nível ${characterData.nivel}`}
        pvAtual={characterData.pvAtual}
        pvTotal={characterData.pvTotal}
        pvTemp={characterData.pvTemp}
        onEditToggle={handleEditToggle}
        editMode={editMode}
      />

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {currentTabComponent()}
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
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  tabsContainer: {
    height: 60, // Altura fixa para as abas
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabsScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  activeTabButton: {
    backgroundColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  activeTabLabel: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default SheetPage;

