import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeatureCarousel from '../components/home/FeatureCarouselAnimado';

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
        <View style={styles.featuresAreaText}>
          <Text style={styles.featuresTitle}>TUDO QUE VOCÊ PRECISA PARA SUAS AVENTURAS</Text>
          <Text style={styles.featuresSubtitle}>
            A Roll & Play é um sistema que se propõe a facilitar a criação e a administração de campanhas de rpg, oferecendo diversas ferramentas para auxiliar a vida de players e mestres.
          </Text>
        </View>
        <FeatureCarousel
          data={[
            { icon: "📝", title: "FICHAS DE PERSONAGENS", description: "Crie e gerencie fichas de personagem para seus jogos de rpg." },
            { icon: "📅", title: "CRIAÇÃO DE SESSÕES", description: "Organize sessões de jogo com agendamento fácil." },
            { icon: "💬", title: "CHAT INTEGRADO", description: "Converse com seu grupo sem sair da plataforma." },
            { icon: "🎲", title: "ROLAGEM DE DADOS", description: "Rolagens com suporte para fórmulas avançadas." },
            { icon: "📊", title: "AGENDAMENTO DE SESSÕES", description: "Envie lembretes automáticos para participantes." },
          ]}
        />
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>PERGUNTAS FREQUENTES</Text>
        <View style={styles.faqGrid}>
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
    backgroundColor: '#0a0e27',
  },
  heroSection: {
    backgroundColor: '#0a0e27',
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
    borderRadius: 20,
    resizeMode: 'contain',
    marginTop: 10,
  },

  featuresSection: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#1a1f3a'
  },
  featuresAreaText: {
    paddingHorizontal: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  featuresSubtitle: {
    fontSize: 14,
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
    backgroundColor: '#0a0e27'
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
    borderRadius: 14,
    padding: 18,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 40,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
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

