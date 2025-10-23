import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

/**
 * @function VisaoGeralSection
 * @description Componente para exibir e editar a visão geral do personagem (nome, raça, classe, etc.).
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de edição e salvamento é simulada, pois a lógica de backend foi removida.
 * @param {object} data - Objeto contendo os dados gerais do personagem.
 * @param {object} atributos - Objeto contendo os valores dos atributos (usado para calcular CA e Iniciativa).
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSave - Função para salvar as alterações (simulada).
 */
const VisaoGeralSection = ({ data, atributos, editMode, onSave }) => {
  const handleChange = (field, value) => {
    if (editMode && onSave) {
      const updatedData = { ...data, [field]: value };
      onSave(updatedData);
    }
  };

  const toggleInspiracao = () => {
    if (onSave) {
      const updatedData = { ...data, inspiracao: !data.inspiracao };
      onSave(updatedData);
    }
  };

  const calcModificador = (valor) => {
    return Math.floor((valor - 10) / 2);
  };

  const formatModificador = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📋</Text>
        <Text style={styles.sectionTitle}>Visão Geral</Text>
      </View>

      <View style={styles.visaoGeralContent}>
        <View style={styles.visaoGeralGrid}>
          {/* Nome */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Nome</Text>
            {editMode ? (
              <TextInput style={styles.input} value={data.nome} onChangeText={(text) => handleChange('nome', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.nome}</Text>
            )}
          </View>

          {/* Raça */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Raça</Text>
            {editMode ? (
              <TextInput style={styles.input} value={data.raca} onChangeText={(text) => handleChange('raca', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.raca}</Text>
            )}
          </View>

          {/* Classe */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Classe</Text>
            {editMode ? (
              <TextInput style={styles.input} value={data.classe} onChangeText={(text) => handleChange('classe', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.classe}</Text>
            )}
          </View>

          {/* Nível */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Nível</Text>
            {editMode ? (
              <TextInput style={styles.input} keyboardType="numeric" value={String(data.nivel)} onChangeText={(text) => handleChange('nivel', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.nivel}</Text>
            )}
          </View>

          {/* Alinhamento */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Alinhamento</Text>
            {editMode ? (
              <TextInput style={styles.input} value={data.alinhamento} onChangeText={(text) => handleChange('alinhamento', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.alinhamento}</Text>
            )}
          </View>

          {/* Experiência */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Experiência</Text>
            {editMode ? (
              <TextInput style={styles.input} keyboardType="numeric" value={String(data.experiencia)} onChangeText={(text) => handleChange('experiencia', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.experiencia}</Text>
            )}
          </View>

          {/* Antecedente */}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Antecedente</Text>
            {editMode ? (
              <TextInput style={styles.input} value={data.antecedente} onChangeText={(text) => handleChange('antecedente', text)} />
            ) : (
              <Text style={styles.infoValue}>{data.antecedente}</Text>
            )}
          </View>
        </View>

        {/* Checkbox de Inspiração */}
        <View style={styles.inspiracaoContainer}>
          <Text style={styles.label}>Inspiração</Text>
          <TouchableOpacity
            style={[styles.inspiracaoButton, data.inspiracao && styles.inspiradoButton]}
            onPress={toggleInspiracao}
            disabled={!editMode} // Desabilita se não estiver em modo de edição
          >
            {data.inspiracao && <Text style={styles.inspiracaoIcon}>☀️</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.atributosDerivados}>
          <View style={styles.derivadoCard}>
            <Text style={styles.derivadoLabel}>Classe de Armadura</Text>
            <Text style={styles.derivadoValor}>{10 + calcModificador(atributos.destreza)}</Text>
          </View>

          <View style={styles.derivadoCard}>
            <Text style={styles.derivadoLabel}>Iniciativa</Text>
            <Text style={styles.derivadoValor}>{formatModificador(calcModificador(atributos.destreza))}</Text>
          </View>

          <View style={styles.derivadoCard}>
            <Text style={styles.derivadoLabel}>Deslocamento</Text>
            <Text style={styles.derivadoValor}>9m</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  visaoGeralContent: {
    // Estilos para o conteúdo principal da visão geral
  },
  visaoGeralGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoGroup: {
    width: '48%', // Duas colunas
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  inspiracaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inspiracaoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspiradoButton: {
    backgroundColor: '#ffeb3b',
    borderColor: '#ffeb3b',
  },
  inspiracaoIcon: {
    fontSize: 20,
  },
  atributosDerivados: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  derivadoCard: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    width: '30%',
  },
  derivadoLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 5,
    textAlign: 'center',
  },
  derivadoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});

export default VisaoGeralSection;

