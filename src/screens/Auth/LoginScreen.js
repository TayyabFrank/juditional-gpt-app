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
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation, route }) {
  const { login, loginAsDemo, loginAsGuest, isLoadingAuth, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const pendingPrompt = route?.params?.pendingPrompt;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }
    await login(email, password);
    if (pendingPrompt) {
      navigation.navigate('AssistantTab', { initialPrompt: pendingPrompt });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleDemoAdvocate = () => {
    loginAsDemo('Advocate High Court');
    if (pendingPrompt) {
      navigation.navigate('AssistantTab', { initialPrompt: pendingPrompt });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    if (pendingPrompt) {
      navigation.navigate('AssistantTab', { initialPrompt: pendingPrompt });
    } else {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        subtitle="Pakistan Law AI Portal"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {pendingPrompt && (
              <View style={styles.pendingPromptBanner}>
                <Text style={styles.pendingPromptLabel}>🔒 LOGIN REQUIRED FOR LEGAL INQUIRY</Text>
                <Text style={styles.pendingPromptText} numberOfLines={2}>
                  "{pendingPrompt}"
                </Text>
              </View>
            )}

            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>MEMBERSHIP PORTAL</Text>
            </View>

            <Text style={styles.title}>Advocate Sign In</Text>
            <Text style={styles.subtitle}>
              Access your saved court briefs, SCMR research history, and statutory drafts.
            </Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OFFICIAL / BAR EMAIL</Text>
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your confidential password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInBtn}
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoadingAuth}
            >
              {isLoadingAuth ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.signInBtnText}>Sign In to JudicialGPT</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR QUICK ACCESS</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 1-Tap Demo Advocate Button */}
            <TouchableOpacity
              style={styles.demoBtn}
              activeOpacity={0.8}
              onPress={handleDemoAdvocate}
            >
              <Text style={styles.demoBtnText}>⚖️ 1-Tap Advocate High Court Login</Text>
            </TouchableOpacity>

            {/* Guest Access Button */}
            <TouchableOpacity
              style={styles.guestBtn}
              activeOpacity={0.8}
              onPress={handleGuest}
            >
              <Text style={styles.guestBtnText}>Continue as Guest Jurist</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupPrompt}>Do not have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Enroll as Advocate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
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
  badgeRow: {
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
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
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
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
  signInBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  signInBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
  demoBtn: {
    backgroundColor: colors.cardBgElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  demoBtnText: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
  guestBtn: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  guestBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupPrompt: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  signupLink: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  pendingPromptBanner: {
    backgroundColor: 'rgba(217, 119, 6, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  pendingPromptLabel: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pendingPromptText: {
    color: colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  }
});
