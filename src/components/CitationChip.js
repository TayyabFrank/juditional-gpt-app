import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function CitationChip({ citation, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.chip}
    >
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.text}>{citation}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
    gap: 4,
  },
  icon: {
    fontSize: 10,
    color: colors.primaryLight,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
  }
});
