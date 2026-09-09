import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';

export default function FeaturesScreen({ navigation }) {
  const FEATURES = [
    {
      icon: '📚',
      badge: 'CASE DATABASE',
      title: '2.4M+ Verified Case Law Repository',
      desc: 'Instant semantic searching across Supreme Court (SCMR), Federal Shariat Court, and High Court law reports (PLD, CLC, YLR, PTD, MLD) from 1947 to present.',
      bullets: [
        'Automated ratio decidendi extraction',
        'Overruled and distinguished precedent warnings',
        'Headnotes and judgment summary generation'
      ]
    },
    {
      icon: '🗣️',
      badge: 'VERNACULAR NLP',
      title: 'Native Regional Language Legal AI',
      desc: 'Formulate questions, examine Urdu plaints, or research in English, Urdu, Balochi, Punjabi, and Sindhi. Understands local court terminology.',
      bullets: [
        'Multilingual query translation with legal precision',
        'Recognition of Arabic and Persian legal phrases',
        'Urdu Nastaliq and standard Arabic script display'
      ]
    },
    {
      icon: '🛡️',
      badge: 'VERIFICATION STANDARD',
      title: 'Zero-Hallucination Citation Verification',
      desc: 'Strict retrieval-augmented architecture guarantees that every precedent, section, and article cited links to authentic Pakistani statutory volumes.',
      bullets: [
        'Pinpoint paragraph and page references',
        'Verification of active statutory amendments',
        'Direct cross-checks with official law gazettes'
      ]
    },
    {
      icon: '✍️',
      badge: 'COURT DRAFTING',
      title: 'Litigation Brief & Petition Drafter',
      desc: 'Transform client facts into structured High Court writ petitions (Article 199), civil appeals, and pre-arrest bail pleas under 498 CrPC.',
      bullets: [
        'Templates adhering to High Court Rules & Orders',
        'Automated grounds and prayer clause drafting',
        'Instant mobile export to copy or share'
      ]
    }
  ];

  const HOW_IT_WORKS = [
    {
      step: '01',
      title: 'Enter Legal Query or Upload Case Brief',
      desc: 'Type your factual proposition, legal dispute, or attach an FIR/plaint in English or any Pakistani regional language.'
    },
    {
      step: '02',
      title: 'Semantic Retrieval from Statutory Corpus',
      desc: 'JudicialGPT indexes relevant provisions from the PPC, CrPC, CPC, Contract Act, and Constitution of Pakistan.'
    },
    {
      step: '03',
      title: 'Ratio Decidendi Precedent Matching',
      desc: 'Identifies authoritative rulings from the Supreme Court (SCMR/PLD) to confirm whether your argument is legally sound.'
    },
    {
      step: '04',
      title: 'Actionable Legal Advice & Citation Output',
      desc: 'Receive comprehensive analysis complete with exact citations, relevant section quotes, and actionable prayer clauses.'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header subtitle="Institutional Architecture & Case Law" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.badge}>INSTITUTIONAL GRADE</Text>
          <Text style={styles.title}>Innovative Legal Architecture</Text>
          <Text style={styles.desc}>
            Engineered to empower High Court advocates, judicial officers, and corporate legal teams with authoritative Pakistani statutory intelligence.
          </Text>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresList}>
          {FEATURES.map((item, idx) => (
            <View key={idx} style={styles.featureCard}>
              <View style={styles.featureCardHeader}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{item.badge}</Text>
                </View>
              </View>

              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>

              <View style={styles.bulletList}>
                {item.bullets.map((b, bIdx) => (
                  <View key={bIdx} style={styles.bulletItem}>
                    <Text style={styles.bulletCheck}>✓</Text>
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* How It Works Section */}
        <View style={styles.sectionHeadingBlock}>
          <Text style={styles.badge}>STEP-BY-STEP WORKFLOW</Text>
          <Text style={styles.title}>How JudicialGPT Works</Text>
        </View>

        <View style={styles.stepsList}>
          {HOW_IT_WORKS.map((step, idx) => (
            <View key={idx} style={styles.stepCard}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumber}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Experience JudicialGPT Mobile</Text>
          <Text style={styles.ctaDesc}>
            Test legal questions against 75+ years of Pakistani Supreme Court jurisprudence.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('AssistantTab')}
          >
            <Text style={styles.ctaBtnText}>Launch Legal Copilot →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 20,
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: 6,
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  featuresList: {
    gap: 14,
    marginBottom: 28,
  },
  featureCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
  },
  featureCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 24,
  },
  badgePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  bulletList: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletCheck: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  bulletText: {
    color: colors.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  sectionHeadingBlock: {
    marginBottom: 14,
  },
  stepsList: {
    gap: 12,
    marginBottom: 24,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  ctaCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    padding: 18,
    alignItems: 'center',
  },
  ctaTitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  ctaDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 17,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  }
});
