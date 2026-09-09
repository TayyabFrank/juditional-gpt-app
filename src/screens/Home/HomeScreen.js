import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import LanguageSelectorModal, { LANGUAGES } from '../../components/LanguageSelectorModal';

export default function HomeScreen({ navigation }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [activeModeIndex, setActiveModeIndex] = useState(0);

  const HERO_MODES = [
    {
      id: 'case-analysis',
      title: 'Case Analysis',
      icon: '⚖️',
      subtitle: 'Deconstruct complex High Court & Supreme Court appeals. Extract key precedents, ratio decidendi, and statute references in seconds.'
    },
    {
      id: 'document-review',
      title: 'Document Review',
      icon: '📑',
      subtitle: 'Upload FIRs, plaints, and stay order applications. Identify critical procedural vulnerabilities, limitation risks, and missing grounds.'
    },
    {
      id: 'legal-research',
      title: 'Legal Research',
      icon: '📚',
      subtitle: 'Semantic search across 2.4M+ citations (SCMR, PLD, CLC, PTD, MLD) with direct link verification and overrule checking.'
    },
    {
      id: 'drafting',
      title: 'Litigation Drafter',
      icon: '🖋️',
      subtitle: 'Auto-generate High Court writ petitions (Art. 199), post-arrest bail petitions (S.497 CrPC), and plaints according to Court Rules.'
    }
  ];

  const handleLaunchAssistant = (queryToAsk) => {
    navigation.navigate('AssistantTab', { initialPrompt: queryToAsk || '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.cardBg} />
      <Header subtitle="Supreme Court & High Court Intelligence" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillDot}>●</Text>
              <Text style={styles.heroPillText}>SUPREME COURT & STATUTORY JURISPRUDENCE</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            Pakistan's Premier <Text style={styles.heroTitleHighlight}>AI Judicial Copilot</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Trained on the Constitution of Pakistan 1973, Federal Statutes, and 75+ years of binding Supreme Court precedents (PLD, SCMR).
          </Text>

          {/* Quick CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={() => handleLaunchAssistant()}
            >
              <Text style={styles.btnPrimaryText}>⚖️ Start Legal Inquiry</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ToolsTab')}
            >
              <Text style={styles.btnSecondaryText}>Explore AI Tools</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5-Language Vernacular AI Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>MULTILINGUAL AI</Text>
          <Text style={styles.sectionTitle}>Vernacular Legal Intelligence</Text>
          <Text style={styles.sectionSubtitle}>
            Consult in English, Urdu, Balochi, Punjabi, or Sindhi with natural legal phrasing.
          </Text>
        </View>

        {/* Language Tabs Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.langScroll}
          contentContainerStyle={styles.langScrollContent}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.id === selectedLang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langTab, isSelected && styles.langTabActive]}
                activeOpacity={0.7}
                onPress={() => setSelectedLang(lang)}
              >
                <Text style={[styles.langTabText, isSelected && styles.langTabTextActive]}>
                  {lang.nativeLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Interactive Query Card */}
        <View style={styles.queryCard}>
          <View style={styles.queryCardHeader}>
            <Text style={styles.queryTag}>{selectedLang.label.toUpperCase()} LEGAL QUERY</Text>
            <TouchableOpacity onPress={() => setIsLangModalOpen(true)}>
              <Text style={styles.changeLangText}>Switch Language ⌵</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.queryText, selectedLang.dir === 'rtl' && styles.rtlText]}>
            "{selectedLang.query}"
          </Text>

          <TouchableOpacity
            style={styles.queryAskBtn}
            activeOpacity={0.8}
            onPress={() => handleLaunchAssistant(selectedLang.query)}
          >
            <Text style={styles.queryAskBtnText}>Analyze in JudicialGPT →</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Core Modes Carousel / Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionBadge}>INTELLIGENCE MODES</Text>
          <Text style={styles.sectionTitle}>Engineered for Advocates</Text>
        </View>

        <View style={styles.modesContainer}>
          {HERO_MODES.map((mode, index) => {
            const isActive = activeModeIndex === index;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeCard, isActive && styles.modeCardActive]}
                activeOpacity={0.75}
                onPress={() => setActiveModeIndex(index)}
              >
                <View style={styles.modeCardTop}>
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                  <Text style={[styles.modeTitle, isActive && styles.modeTitleActive]}>
                    {mode.title}
                  </Text>
                </View>
                <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Law Statistics Grid */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Verified Knowledge Base</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.4M+</Text>
              <Text style={styles.statLabel}>Court Precedents</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99.4%</Text>
              <Text style={styles.statLabel}>Citation Precision</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1947–26</Text>
              <Text style={styles.statLabel}>Full Law Archives</Text>
            </View>
          </View>
        </View>

        {/* Bottom Banner */}
        <View style={styles.footerBanner}>
          <Text style={styles.footerBannerTitle}>Need Instant Legal Counsel?</Text>
          <Text style={styles.footerBannerText}>
            Logged in as {currentUser?.name || 'Advocate'} ({currentUser?.role || 'High Court'}). Ready for instant citations and brief drafting.
          </Text>
          <TouchableOpacity
            style={styles.footerBannerBtn}
            onPress={() => handleLaunchAssistant()}
          >
            <Text style={styles.footerBannerBtnText}>Open AI Legal Workspace</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={isLangModalOpen}
        selectedLangId={selectedLang.id}
        onSelect={(lang) => setSelectedLang(lang)}
        onClose={() => setIsLangModalOpen(false)}
      />
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
  heroCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    marginBottom: 20,
  },
  heroBadgeRow: {
    marginBottom: 12,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 6,
  },
  heroPillDot: {
    fontSize: 8,
    color: colors.primary,
  },
  heroPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryLight,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textLight,
    lineHeight: 32,
    marginBottom: 8,
  },
  heroTitleHighlight: {
    color: colors.primary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginBottom: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  langScroll: {
    marginBottom: 12,
  },
  langScrollContent: {
    gap: 8,
  },
  langTab: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  langTabActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.primary,
  },
  langTabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  langTabTextActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  queryCard: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 20,
  },
  queryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  queryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
  },
  changeLangText: {
    fontSize: 11,
    color: colors.primaryLight,
  },
  queryText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  rtlText: {
    textAlign: 'right',
    fontSize: 14,
  },
  queryAskBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignSelf: 'flex-start',
  },
  queryAskBtnText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  modesContainer: {
    gap: 10,
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  modeCardActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  modeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  modeIcon: {
    fontSize: 18,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  modeTitleActive: {
    color: colors.primaryLight,
  },
  modeSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  statsCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gold,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryLight,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderLight,
  },
  footerBanner: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    padding: 18,
  },
  footerBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
  },
  footerBannerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  footerBannerBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerBannerBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  }
});
