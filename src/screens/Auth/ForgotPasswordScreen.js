import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleReset = () => {
    if (!email.trim()) return;
    setIsSent(true);
    Alert.alert(
      'Recovery Email Dispatched',
      `A confidential password reset token has been dispatched to ${email}. Check your inbox to restore advocate credentials.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        subtitle="Credentials Recovery"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.badgeText}>SECURITY & ACCESS RECOVERY</Text>
          <Text style={styles.title}>Reset Advocate Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered bar or personal email to receive secure recovery instructions.
          </Text>

          {isSent ? (
            <View style={styles.successBox}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We sent password restoration link to {email}.
              </Text>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.backBtnText}>Return to Sign In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REGISTERED EMAIL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="advocate@judicialgpt.pk"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.8}
                onPress={handleReset}
              >
                <Text style={styles.submitBtnText}>Dispatch Recovery Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelBtnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    fontSize: 36,
    color: colors.primaryLight,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 6,
  },
  successText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  }
});
