import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout, loginAsDemo, loginAsGuest } = useAuth();

  const handleRoleSwitch = (role) => {
    loginAsDemo(role);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of JudicialGPT?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => logout() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header subtitle="Advocate Credentials & Preferences" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User ID Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </Text>
            </View>

            <View style={styles.avatarTextCol}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{currentUser?.name || 'Advocate Tayyab'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ VERIFIED</Text>
                </View>
              </View>
              <Text style={styles.userRole}>{currentUser?.role || 'Advocate High Court'}</Text>
              <Text style={styles.userEmail}>{currentUser?.email || 'tayyab.advocate@judicialgpt.pk'}</Text>
            </View>
          </View>

          {/* Bar Council License Strip */}
          <View style={styles.licenseStrip}>
            <Text style={styles.licenseLabel}>BAR ENROLLMENT NO:</Text>
            <Text style={styles.licenseValue}>{currentUser?.barCouncilNumber || 'LHC-ROLL-7890'}</Text>
          </View>
        </View>

        {/* Quick Role Switcher for Testing */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>SWITCH JURIST ROLE (DEMO)</Text>
          <View style={styles.roleGrid}>
            <TouchableOpacity
              style={styles.roleBtn}
              onPress={() => handleRoleSwitch('Advocate High Court')}
            >
              <Text style={styles.roleBtnText}>⚖️ Advocate High Court</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleBtn}
              onPress={() => handleRoleSwitch('Justice (Retd.) / Judge')}
            >
              <Text style={styles.roleBtnText}>🏛️ Judicial Officer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleBtn}
              onPress={() => handleRoleSwitch('Corporate Legal Counsel')}
            >
              <Text style={styles.roleBtnText}>💼 Corporate Counsel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleBtn}
              onPress={() => handleRoleSwitch('Law Student / Researcher')}
            >
              <Text style={styles.roleBtnText}>🎓 Law Researcher</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Knowledge & AI Engine Settings */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>AI ENGINE & DATABASE</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Active AI Model</Text>
              <Text style={styles.settingValue}>JudicialGPT Pro (v2.6)</Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Jurisdiction Corpus</Text>
              <Text style={styles.settingValue}>Pakistan Law (1947–2026)</Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Offline Fallback Engine</Text>
              <Text style={[styles.settingValue, { color: colors.success }]}>Active (Zero Downtime)</Text>
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Zero-Hallucination Guardrail</Text>
              <Text style={[styles.settingValue, { color: colors.success }]}>Enforced</Text>
            </View>
          </View>
        </View>

        {/* Account Controls */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.actionBtnText}>Sign In to Another Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.actionBtnText}>Create New Advocate Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutBtnText}>Sign Out of Mobile App</Text>
          </TouchableOpacity>
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
  profileCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 18,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primaryMuted,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    color: colors.primaryLight,
    fontSize: 24,
    fontWeight: '800',
  },
  avatarTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: colors.primaryLight,
    fontSize: 9,
    fontWeight: '800',
  },
  userRole: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  licenseStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  licenseLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  licenseValue: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  roleGrid: {
    gap: 8,
  },
  roleBtn: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  roleBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  settingCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  settingValue: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  signOutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutBtnText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '700',
  }
});
