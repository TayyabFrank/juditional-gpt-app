import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function DocumentModal({ visible, onClose, onSelectDocument }) {
  const documentTemplates = [
    {
      id: 'fir',
      icon: '📄',
      title: 'First Information Report (FIR)',
      desc: 'Criminal complaint registered under Section 154 Cr.P.C.'
    },
    {
      id: 'plaint',
      icon: '⚖️',
      title: 'Civil Plaint (Order VII Rule 1 CPC)',
      desc: 'Specific performance or declaration of title suit'
    },
    {
      id: 'writ',
      icon: '🏛️',
      title: 'High Court Writ Petition (Art. 199)',
      desc: 'Fundamental rights or mandamus against public officer'
    },
    {
      id: 'bail',
      icon: '📑',
      title: 'Post-Arrest Bail Memo (S. 497 CrPC)',
      desc: 'Grounds of delay, false implication, and statutory relief'
    }
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Attach Legal Document</Text>
              <Text style={styles.subtitle}>Select document type for automated AI analysis</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {documentTemplates.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => {
                  onSelectDocument(item);
                  onClose();
                }}
              >
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
                <Text style={styles.itemChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  itemIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemDesc: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  itemChevron: {
    color: colors.primaryLight,
    fontSize: 20,
    marginLeft: 8,
  }
});
