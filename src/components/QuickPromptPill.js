import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function QuickPromptPill({ label, icon, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.pill}
      onPress={onPress}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  icon: {
    fontSize: 12,
    color: colors.gold,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  }
});
