import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

/**
 * @function AtributosSection
 * @description Componente para exibir e editar atributos e perícias do personagem.
 * Adaptado do projeto React original para React Native.
 * A funcionalidade de edição e salvamento é simulada, pois a lógica de backend foi removida.
 * @param {object} atributos - Objeto contendo os valores dos atributos (forca, destreza, etc.).
 * @param {object} pericias - Objeto indicando proficiência em cada perícia.
 * @param {number} nivel - Nível do personagem, usado para calcular o bônus de proficiência.
 * @param {boolean} editMode - Indica se a seção está em modo de edição.
 * @param {function} onSaveAtributos - Função para salvar os atributos (simulada).
 * @param {function} onSavePericias - Função para salvar as perícias (simulada).
 */
const AtributosSection = ({ atributos, pericias, nivel, editMode, onSaveAtributos, onSavePericias }) => {
  const calcModificador = (valor) => {
    return Math.floor((valor - 10) / 2);
  };

  const formatModificador = (mod) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const calcBonusProficiencia = (nivel) => {
    return Math.floor((nivel - 1) / 4) + 2;
  };

  const handleChangeAtributos = (name, value) => {
    if (editMode && onSaveAtributos) {
      const updatedAtributos = { ...atributos, [name]: Number.parseInt(value) || 0 };
      onSaveAtributos(updatedAtributos);
    }
  };

  const handleToggleProficiencia = (pericia) => {
    if (editMode && onSavePericias) {
      const updatedPericias = {
        ...pericias,
        [pericia]: !pericias[pericia],
      };
      onSavePericias(updatedPericias);
    }
  };

  const atributosLabels = {
    forca: { nome: "Força", abrev: "FOR" },
    destreza: { nome: "Destreza", abrev: "DES" },
    constituicao: { nome: "Constituição", abrev: "CON" },
    inteligencia: { nome: "Inteligência", abrev: "INT" },
    sabedoria: { nome: "Sabedoria", abrev: "SAB" },
    carisma: { nome: "Carisma", abrev: "CAR" },
  };

  const periciasInfo = [
    { id: "acrobacia", nome: "Acrobacia", atributo: "destreza" },
    { id: "arcanismo", nome: "Arcanismo", atributo: "inteligencia" },
    { id: "atletismo", nome: "Atletismo", atributo: "forca" },
    { id: "atuacao", nome: "Atuação", atributo: "carisma" },
    { id: "enganacao", nome: "Enganação", atributo: "carisma" },
    { id: "furtividade", nome: "Furtividade", atributo: "destreza" },
    { id: "historia", nome: "História", atributo: "inteligencia" },
    { id: "intimidacao", nome: "Intimidação", atributo: "carisma" },
    { id: "intuicao", nome: "Intuição", atributo: "sabedoria" },
    { id: "investigacao", nome: "Investigação", atributo: "inteligencia" },
    { id: "lidarComAnimais", nome: "Lidar com Animais", atributo: "sabedoria" },
    { id: "medicina", nome: "Medicina", atributo: "sabedoria" },
    { id: "natureza", nome: "Natureza", atributo: "inteligencia" },
    { id: "percepcao", nome: "Percepção", atributo: "sabedoria" },
    { id: "persuasao", nome: "Persuasão", atributo: "carisma" },
    { id: "prestidigitacao", nome: "Prestidigitação", atributo: "destreza" },
    { id: "religiao", nome: "Religião", atributo: "inteligencia" },
    { id: "sobrevivencia", nome: "Sobrevivência", atributo: "sabedoria" },
  ];

  const bonusProficiencia = calcBonusProficiencia(nivel);

  const calcBonusPericia = (periciaId) => {
    const info = periciasInfo.find((p) => p.id === periciaId);
    const modAtributo = calcModificador(atributos[info.atributo]);

    if (pericias[periciaId]) {
      return modAtributo + bonusProficiencia;
    }

    return modAtributo;
  };

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>💪</Text>
        <Text style={styles.sectionTitle}>Atributos</Text>
      </View>

      <View style={styles.atributosGrid}>
        {Object.entries(atributosLabels).map(([key, { nome, abrev }]) => (
          <View key={key} style={styles.atributoCard}>
            <Text style={styles.atributoHeader}>{abrev}</Text>
            <Text style={styles.atributoNome}>{nome}</Text>

            <View style={styles.atributoValor}>
              {editMode ? (
                <TextInput
                  style={styles.inputAtributo}
                  keyboardType="numeric"
                  value={String(atributos[key])}
                  onChangeText={(text) => handleChangeAtributos(key, text)}
                  maxLength={2} // Limitar a 2 dígitos para atributos
                />
              ) : (
                <Text style={styles.atributoValorText}>{atributos[key]}</Text>
              )}
            </View>

            <Text style={styles.atributoModificador}>{formatModificador(calcModificador(atributos[key]))}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎯</Text>
        <Text style={styles.sectionTitle}>Perícias e Proficiências</Text>
      </View>

      <View style={styles.bonusProficiencia}>
        <Text>Bônus de Proficiência: </Text>
        <Text style={styles.bonusValor}>{formatModificador(bonusProficiencia)}</Text>
      </View>

      <View style={styles.periciasList}>
        {periciasInfo.map((pericia) => (
          <TouchableOpacity
            key={pericia.id}
            style={styles.periciaItem}
            onPress={() => handleToggleProficiencia(pericia.id)}
            disabled={!editMode}
          >
            <Text style={styles.periciaProficiente}>{pericias[pericia.id] ? "●" : "○"}</Text>
            <Text style={styles.periciaBonus}>{formatModificador(calcBonusPericia(pericia.id))}</Text>
            <Text style={styles.periciaNome}>{pericia.nome}</Text>
            <Text style={styles.periciaAtributo}>
              ({pericia.atributo.substring(0, 3).toUpperCase()})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.outrasProficiencias}>
        <Text style={styles.outrasProficienciasTitle}>Outras Proficiências e Idiomas</Text>
        <View style={styles.proficienciasContent}>
          {editMode ? (
            <TextInput
              style={styles.proficienciasTextarea}
              placeholder="Adicione outras proficiências e idiomas aqui..."
              defaultValue="Idiomas: Comum, Anão\nArmas: Simples, Marciais\nArmaduras: Todas as armaduras e escudos\nFerramentas: Ferramentas de ferreiro"
              multiline
              textAlignVertical="top"
            />
          ) : (
            <View>
              <Text style={styles.proficienciasText}>
                <Text style={styles.proficienciasTextBold}>Idiomas:</Text> Comum, Anão
              </Text>
              <Text style={styles.proficienciasText}>
                <Text style={styles.proficienciasTextBold}>Armas:</Text> Simples, Marciais
              </Text>
              <Text style={styles.proficienciasText}>
                <Text style={styles.proficienciasTextBold}>Armaduras:</Text> Todas as armaduras e escudos
              </Text>
              <Text style={styles.proficienciasText}>
                <Text style={styles.proficienciasTextBold}>Ferramentas:</Text> Ferramentas de ferreiro
              </Text>
            </View>
          )}
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
  atributosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  atributoCard: {
    width: '30%', // Ajuste para 3 colunas em telas menores
    alignItems: 'center',
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
  },
  atributoHeader: {
    fontSize: 12,
    color: '#777',
  },
  atributoNome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  atributoValor: {
    marginBottom: 5,
  },
  inputAtributo: {
    width: 40,
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  atributoValorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  atributoModificador: {
    fontSize: 16,
    color: '#555',
  },
  bonusProficiencia: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
  },
  bonusValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginLeft: 5,
  },
  periciasList: {
    marginBottom: 20,
  },
  periciaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  periciaProficiente: {
    fontSize: 16,
    marginRight: 10,
    color: '#3b82f6',
  },
  periciaBonus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    width: 40,
    textAlign: 'center',
  },
  periciaNome: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  periciaAtributo: {
    fontSize: 14,
    color: '#777',
  },
  outrasProficiencias: {
    marginTop: 10,
  },
  outrasProficienciasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  proficienciasContent: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  proficienciasTextarea: {
    minHeight: 120,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  proficienciasText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 5,
  },
  proficienciasTextBold: {
    fontWeight: 'bold',
  },
});

export default AtributosSection;

