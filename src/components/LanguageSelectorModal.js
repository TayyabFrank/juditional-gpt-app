import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export const LANGUAGES = [
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English Law',
    dir: 'ltr',
    badge: 'FEDERAL',
    query: 'What are the legal consequences of breaching a contract in Pakistan, and can a court order specific performance?'
  },
  {
    id: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    dir: 'rtl',
    badge: 'قومی زبان',
    query: 'پاکستان میں معاہدے کی خلاف ورزی کے قانونی نتائج کیا ہیں، اور کیا عدالت تعمیلِ مختص کا حکم دے سکتی ہے؟'
  },
  {
    id: 'ba',
    label: 'Balochi',
    nativeLabel: 'بلوچی',
    dir: 'rtl',
    badge: 'صوبائی زبان',
    query: 'پاکستان ء معاہدے شکنئی کے قانونی نتیجہ انت، و آیا عدالت خاص اجرا ء حکم دئے سگیت؟'
  },
  {
    id: 'pa',
    label: 'Punjabi',
    nativeLabel: 'پنجابی',
    dir: 'rtl',
    badge: 'صوبائی زبان',
    query: 'پاکستان وچ معاہدے دی خلاف ورزی دے کیہ قانونی نتیجے ہوندے نیں، تے کیہ عدالت خاص کارکردگی دا حکم دے سکدی اے؟'
  },
  {
    id: 'sd',
    label: 'Sindhi',
    nativeLabel: 'سنڌي',
    dir: 'rtl',
    badge: 'صوبائي ٻولي',
    query: 'پاڪستان ۾ معاهدي جي ڀڃڪڙي جا قانوني نتيجا ڇا آهن، ۽ ڇا عدالت خاص عملداري جو حڪم ڏئي سگهي ٿي؟'
  }
];

export default function LanguageSelectorModal({ visible, selectedLangId, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Jurisdiction Language</Text>
              <Text style={styles.subtitle}>Select language for Pakistani statutory AI assistance</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.id === selectedLangId;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[styles.item, isSelected && styles.itemSelected]}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(lang);
                    onClose();
                  }}
                >
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemNative, isSelected && styles.itemTextSelected]}>
                      {lang.nativeLabel}
                    </Text>
                    <Text style={styles.itemLabel}>
                      {lang.label} • <Text style={styles.itemBadge}>{lang.badge}</Text>
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
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
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.primary,
  },
  itemInfo: {
    flex: 1,
  },
  itemNative: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemTextSelected: {
    color: colors.primaryLight,
  },
  itemLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  itemBadge: {
    color: colors.gold,
    fontWeight: '600',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});
