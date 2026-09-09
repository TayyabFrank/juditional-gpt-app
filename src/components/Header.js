import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function Header({ title = 'JudicialGPT', subtitle, rightElement, onBack, navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>⚖</Text>
        </View>

        <View>
          <View style={styles.titleRow}>
            <Text style={styles.titlePrefix}>Judicial</Text>
            <Text style={styles.titleSuffix}>GPT</Text>
            <View style={styles.statusDot} />
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightRow}>
        {rightElement || (
          <View style={styles.liveIndicator}>
            <Text style={styles.liveDot}>●</Text>
            <Text style={styles.liveText}>LAW 2026</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 18,
    color: colors.primaryLight,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titlePrefix: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  titleSuffix: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginLeft: 6,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 4,
  },
  liveDot: {
    fontSize: 8,
    color: colors.success,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  }
});
