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

export default function AiToolsScreen({ navigation }) {
  const TOOLS = [
    {
      id: 'writ',
      badge: 'CONSTITUTIONAL JURISDICTION',
      icon: '🏛️',
      title: 'High Court Writ Drafter (Art. 199)',
      desc: 'Formulate judicial review petitions, mandamus, prohibition, and certiorari against statutory bodies with grounds and prayer clauses.',
      statute: 'Article 199, Constitution 1973',
      defaultPrompt: 'Draft a High Court Writ Petition under Article 199 of the Constitution of Pakistan challenging an arbitrary administrative order.'
    },
    {
      id: 'bail',
      badge: 'CRIMINAL DEFENSE',
      icon: '⚖️',
      title: 'Post-Arrest Bail Analyzer (S. 497 CrPC)',
      desc: 'Evaluate non-bailable offences, statutory delay grounds, cross-version cases, and absence of ocular testimony corroboration.',
      statute: 'Section 497, Code of Criminal Procedure 1898',
      defaultPrompt: 'Analyze post-arrest bail grounds under Section 497 Cr.P.C. for offences not falling within the prohibitory clause.'
    },
    {
      id: 'limitation',
      badge: 'PROCEDURAL AUDIT',
      icon: '⏱️',
      title: 'Limitation & Vacation Auditor',
      desc: 'Compute filing deadlines under the Limitation Act 1908, accounting for High Court winter vacations and copy preparation days.',
      statute: 'Limitation Act 1908 & Section 5 Condonation',
      defaultPrompt: 'Calculate the limitation period and viability of Section 5 delay condonation for filing a Civil Revision in High Court.'
    },
    {
      id: 'contract',
      badge: 'COMMERCIAL LITIGATION',
      icon: '📜',
      title: 'Contract Breach & Specific Relief',
      desc: 'Determine adequacy of monetary damages under Section 73 Contract Act vs mandatory specific performance of real estate agreements.',
      statute: 'Contract Act 1872 & Specific Relief Act 1877',
      defaultPrompt: 'Examine suit for specific performance of an agreement to sell immovable property when balance consideration is deposited in court.'
    },
    {
      id: 'evidence',
      badge: 'TRIAL ADVOCACY',
      icon: '🔍',
      title: 'Qanun-e-Shahadat Evidence Checker',
      desc: 'Audit electronic evidence, forensic reports, CCTV footage, and call detail records (CDRs) under Article 164 of QSO 1984.',
      statute: 'Qanun-e-Shahadat Order 1984',
      defaultPrompt: 'What are the legal prerequisites for admissibility of modern audio/video recordings under Article 164 of the Qanun-e-Shahadat Order 1984?'
    },
    {
      id: 'service',
      badge: 'ADMINISTRATIVE TRIBUNAL',
      icon: '📋',
      title: 'Service Tribunal Appeal Drafter',
      desc: 'Draft service appeals against departmental penalties, seniority disputes, and supersession under the Service Tribunals Act 1973.',
      statute: 'Civil Servants Act 1973 & Service Tribunals Act',
      defaultPrompt: 'Outline grounds of appeal before Federal Service Tribunal against minor departmental penalty without regular inquiry.'
    }
  ];

  const handleRunTool = (tool) => {
    navigation.navigate('AssistantTab', { initialPrompt: tool.defaultPrompt });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header subtitle="Specialized Statutory Legal Toolkits" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.headerPill}>PROCEDURAL AI CO-COUNSEL</Text>
          <Text style={styles.headerTitle}>AI Legal Toolkits</Text>
          <Text style={styles.headerDesc}>
            Specialized procedural engines tuned to Supreme Court benchmarks and Provincial High Court Rules.
          </Text>
        </View>

        <View style={styles.toolList}>
          {TOOLS.map((tool) => (
            <View key={tool.id} style={styles.toolCard}>
              <View style={styles.toolHeader}>
                <View style={styles.toolBadgeContainer}>
                  <Text style={styles.toolBadge}>{tool.badge}</Text>
                </View>
                <Text style={styles.statuteLabel}>{tool.statute}</Text>
              </View>

              <View style={styles.toolBodyRow}>
                <Text style={styles.toolIcon}>{tool.icon}</Text>
                <View style={styles.toolTextCol}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDesc}>{tool.desc}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.runToolBtn}
                activeOpacity={0.8}
                onPress={() => handleRunTool(tool)}
              >
                <Text style={styles.runToolBtnText}>Launch Tool in Copilot →</Text>
              </TouchableOpacity>
            </View>
          ))}
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
    marginBottom: 18,
  },
  headerPill: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  toolList: {
    gap: 14,
  },
  toolCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
  },
  toolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolBadgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  toolBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  statuteLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  toolBodyRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 12,
  },
  toolIcon: {
    fontSize: 26,
    marginTop: 2,
  },
  toolTextCol: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  toolDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  runToolBtn: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    paddingVertical: 10,
    alignItems: 'center',
  },
  runToolBtnText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  }
});
