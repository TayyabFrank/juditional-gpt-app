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

export default function SignupScreen({ navigation, route }) {
  const { signup, isLoadingAuth, currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [barNumber, setBarNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('Advocate High Court');

  const pendingPrompt = route?.params?.pendingPrompt;

  const ROLES = [
    'Advocate High Court',
    'Advocate Supreme Court',
    'Corporate Legal Advisor',
    'Law Student / Scholar'
  ];

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }
    await signup(name, email, password, selectedRole);
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
                <Text style={styles.pendingPromptLabel}>🔒 REGISTRATION REQUIRED TO CONSULT CHATBOT</Text>
                <Text style={styles.pendingPromptText} numberOfLines={2}>
                  "{pendingPrompt}"
                </Text>
              </View>
            )}

            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>ENROLLMENT REGISTRATION</Text>
            </View>

            <Text style={styles.title}>Advocate Registration</Text>
            <Text style={styles.subtitle}>
              Join over 12,000+ Pakistani legal professionals using AI-assisted case intelligence.
            </Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>FULL NAME (WITH HONORIFIC)</Text>
              <TextInput
                style={styles.input}
                placeholder="Advocate Muhammad Tayyab"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Role Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>LEGAL CAPACITY / ROLE</Text>
              <View style={styles.roleGrid}>
                {ROLES.map((role) => {
                  const isSelected = selectedRole === role;
                  return (
                    <TouchableOpacity
                      key={role}
                      style={[styles.rolePill, isSelected && styles.rolePillActive]}
                      onPress={() => setSelectedRole(role)}
                    >
                      <Text style={[styles.rolePillText, isSelected && styles.rolePillTextActive]}>
                        {role}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="tayyab.adv@gmail.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Bar Council Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>BAR ENROLLMENT NUMBER (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="LHC-ROLL-2024-XXXX"
                placeholderTextColor={colors.textMuted}
                value={barNumber}
                onChangeText={setBarNumber}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SECURE PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum 8 characters"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.signupBtn}
              activeOpacity={0.8}
              onPress={handleSignup}
              disabled={isLoadingAuth}
            >
              {isLoadingAuth ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.signupBtnText}>Complete Advocate Enrollment</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In Here</Text>
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
    paddingBottom: 40,
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
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rolePill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rolePillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.primary,
  },
  rolePillText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  rolePillTextActive: {
    color: colors.primaryLight,
    fontWeight: '700',
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
  signupBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  signupBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  loginLink: {
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
