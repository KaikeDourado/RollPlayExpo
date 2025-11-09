
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Importe ícones se necessário, por exemplo, de '@expo/vector-icons'
// import { Feather } from '@expo/vector-icons'; // Para o ícone de check

/**
 * @function HomePage
 * @description Tela inicial do aplicativo, adaptada do projeto React original.
 * Converte elementos HTML para componentes React Native e ajusta o estilo para mobile.
 * Remove Navbar e Footer, pois a navegação e layout são gerenciados de forma diferente no RN.
 */
export default function HomePage() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>SUA AVENTURA COMEÇA AQUI</Text>
          <Text style={styles.heroDescription}>
            ROLL & PLAY É UMA PLATAFORMA GRATUITA PARA JOGADORES DE RPG DE MESA.
            CRIE PERSONAGENS, ORGANIZE SESSÕES E ROLE DADOS - TUDO EM UM SÓ LUGAR.
          </Text>
        </View>
        <Image source={require("../../assets/wizard_image.jpg")} style={styles.heroImage} />
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>TUDO QUE VOCÊ PRECISA PARA SUAS AVENTURAS</Text>
        <Text style={styles.featuresSubtitle}>
          A Roll & Play é um sistema que se propõe a facilitar a criação e a administração de campanhas de rpg, oferecendo diversas ferramentas para auxiliar a vida de players e mestres.
        </Text>

        <View style={styles.featuresGrid}>
          <FeatureCard icon="📝" title="FICHAS DE PERSONAGENS" description="Crie e gerencie fichas de personagem para seus jogos de rpg, com atualização em tempo real e compartilhamento fácil." />
          <FeatureCard icon="📅" title="CRIAÇÃO DE SESSÕES" description="Organize suas sessões de jogo criando salas virtuais e definindo agendamento de aventuras para seu grupo." />
          <FeatureCard icon="💬" title="CHAT INTEGRADO" description="Comunique-se com outros através de nosso chat integrado, tudo reunido na mesma plataforma." />
          <FeatureCard icon="🎲" title="ROLAGEM DE DADOS" description="Sistema avançado de rolagem de dados com suporte para fórmulas complexas e histórico de rolagens." />
          <FeatureCard icon="📊" title="AGENDAMENTO DE SESSÕES" description="Agende sessões de jogo e envie lembretes automáticos para todos os participantes." />
          <FeatureCard icon="🤓" title="APOIO À EDUCAÇÃO" description="Utilize o roll & play como uma ferramenta pedagógica para ensinar narrativa, trabalho em equipe, resolução de problemas e criatividade de forma divertida e engajadora." />
          <FeatureCard icon="🎮" title="PLANEJAMENTO DE AULAS GAMIFICADAS" description="Crie sessões adaptadas para o ambiente educacional, com recursos interativos, atividades personalizadas e acompanhamento do desempenho dos alunos por meio de rpgs temáticos." />
          <FeatureCard icon="📚" title="BIBLIOTECA DE RECURSOS" description="Acesse uma vasta biblioteca de recursos, incluindo regras, materiais e aventuras prontas para jogar." />
        </View>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>PERGUNTAS FREQUENTES</Text>
        <View style={styles.faqGrid}>
          <FAQItem question="O ROLL & PLAY É REALMENTE GRATUITO?" answer="Sim, o roll & play é 100% gratuito. Não há recursos premium ou conteúdos para usuários pagantes. Nosso objetivo é tornar o rpg acessível a todos." />
          <FAQItem question="POSSO USAR O ROLL & PLAY NO CELULAR?" answer="Sim, o roll & play é totalmente responsivo e funciona em qualquer dispositivo: desktop, móveis, tablets e consoles. Você pode acessar suas fichas e sessões de qualquer lugar." />
          <FAQItem question="QUAIS SISTEMAS DE RPG SÃO SUPORTADOS?" answer="Atualmente, o roll & play oferece suporte exclusivo ao sistemas d&d 5e (e 5.5e). No entanto, nosso objetivo é expandir para outros sistemas populares, além de permitir a criação de fichas personalizadas para tais sistemas." />
          <FAQItem question="COMO FAÇO PARA CONVIDAR MEUS AMIGOS PARA UMA SESSÃO?" answer="Ao criar uma sessão, você receberá um link de convite que pode ser compartilhado com seus amigos. Eles precisarão ter uma conta no roll & play para participar." />
          <FAQItem question="PRECISO CRIAR UMA CONTA PARA USAR?" answer="Sim, é necessário criar uma conta para acessar as funcionalidades do roll & play. O registro é rápido e gratuito, e só pedimos informações essenciais." />
          <FAQItem question="VOCÊS TÊM PLANOS PARA ADICIONAR NOVAS FUNCIONALIDADES?" answer="Absolutamente! Estamos constantemente trabalhando em novas funcionalidades e melhorias com base no feedback da comunidade. Fique atento às atualizações!" />
        </View>
      </View>
    </ScrollView>
  );
}

// Componentes auxiliares para manter o código limpo
const FeatureCard = ({ icon, title, description }) => (
  <View style={featureCardStyles.card}>
    <View style={featureCardStyles.iconContainer}>
      <Text style={featureCardStyles.icon}>{icon}</Text>
    </View>
    <Text style={featureCardStyles.title}>{title}</Text>
    <Text style={featureCardStyles.description}>{description}</Text>
  </View>
);

const FAQItem = ({ question, answer }) => (
  <View style={faqItemStyles.item}>
    <Text style={faqItemStyles.question}>{question}</Text>
    <Text style={faqItemStyles.answer}>{answer}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  heroSection: {
    backgroundColor: '#020717',
    paddingVertical: 50,
    alignItems: 'center',
  },
  heroContent: {
    width: '90%',
    maxWidth: 600,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },

  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#131525'
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresSubtitle: {
    fontSize: 16,
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 700,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  faqSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#020717'
  },
  faqTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 30,
  },
  faqGrid: {
    width: '100%',
    maxWidth: 800,
  },
});

const featureCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

const faqItemStyles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: '#666',
  },
});

