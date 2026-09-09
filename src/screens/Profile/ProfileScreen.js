import React, { useState, useEffect } from 'react';
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
import {
  getUserChatSessions,
  clearUserChatHistory
} from '../../services/chatService';

export default function ProfileScreen({ navigation }) {
  const { currentUser, logout, loginAsDemo, loginAsGuest } = useAuth();
  const [userSessions, setUserSessions] = useState([]);

  useEffect(() => {
    loadUserSessions();
  }, [currentUser?.uid, currentUser?.email]);

  const loadUserSessions = async () => {
    const userId = currentUser?.uid || 'adv-tayyab-786';
    const sessions = await getUserChatSessions(userId);
    setUserSessions(sessions);
  };

  const handleRoleSwitch = (role) => {
    loginAsDemo(role);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Saved History',
      'Are you sure you want to permanently clear previous chat history for this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const userId = currentUser?.uid || 'adv-tayyab-786';
            await clearUserChatHistory(userId);
            setUserSessions([]);
          }
        }
      ]
    );
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
      <Header subtitle="Advocate Credentials & Chat History" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User ID Card */}
        {currentUser ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </Text>
              </View>

              <View style={styles.avatarTextCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{currentUser?.name || 'Advocate'}</Text>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.userRole}>{currentUser?.role || 'Advocate High Court'}</Text>
                <Text style={styles.userEmail}>{currentUser?.email || 'advocate@judicialgpt.pk'}</Text>
              </View>
            </View>

            {/* Bar Council License Strip */}
            <View style={styles.licenseStrip}>
              <Text style={styles.licenseLabel}>ACCOUNT USER ID:</Text>
              <Text style={styles.licenseValue}>{currentUser?.uid || 'adv-id'}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.profileCard}>
            <View style={styles.avatarRow}>
              <View style={[styles.avatarCircle, { borderColor: colors.gold, backgroundColor: 'rgba(217, 119, 6, 0.15)' }]}>
                <Text style={[styles.avatarLetter, { color: colors.gold }]}>👤</Text>
              </View>
              <View style={styles.avatarTextCol}>
                <Text style={styles.userName}>Guest Jurist</Text>
                <Text style={styles.userRole}>Preview Mode (Not Signed In)</Text>
                <Text style={styles.userEmail}>Sign in to save research history</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <TouchableOpacity
                style={[styles.openChatbotBtn, { paddingVertical: 10 }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.openChatbotBtnText}>Sign In to Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.clearHistoryBtn, { paddingVertical: 10, borderColor: colors.primary, flex: 1 }]}
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={[styles.clearHistoryBtnText, { color: colors.primaryLight }]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Saved Chat History Section for This Account */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>SAVED CHAT HISTORY IN THIS ACCOUNT</Text>
            {currentUser && (
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>{userSessions.length} Case Inquiries</Text>
              </View>
            )}
          </View>

          {!currentUser ? (
            <View style={styles.emptyHistoryCard}>
              <Text style={styles.emptyHistoryIcon}>🔒</Text>
              <Text style={styles.emptyHistoryTitle}>Personal Account Required</Text>
              <Text style={styles.emptyHistorySubtitle}>
                Sign in or register your advocate profile to consult the AI and automatically save all your research history.
              </Text>
              <TouchableOpacity
                style={styles.startInquiryBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.startInquiryBtnText}>Sign In to View History</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.accountHintText}>
                All chats, precedents & legal responses are automatically stored in your account:
                {' '}<Text style={styles.highlightText}>{currentUser?.email || 'Active Account'}</Text>
              </Text>

              {userSessions.length > 0 ? (
            <View style={styles.historyCard}>
              {userSessions.map((session, index) => {
                const msgCount = session.messages ? session.messages.length : 0;
                const lastMsg =
                  session.messages && session.messages.length > 0
                    ? session.messages[session.messages.length - 1].text
                    : '';
                const dateStr = session.createdAt
                  ? new Date(session.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recent';

                return (
                  <TouchableOpacity
                    key={session.id || index}
                    style={[
                      styles.historyItemRow,
                      index < userSessions.length - 1 && styles.historyItemBorder
                    ]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Assistant', { sessionId: session.id })}
                  >
                    <View style={styles.historyItemIconBox}>
                      <Text style={styles.historyItemIcon}>⚖️</Text>
                    </View>
                    <View style={styles.historyItemContent}>
                      <View style={styles.historyItemHeader}>
                        <Text style={styles.historyItemTitle} numberOfLines={1}>
                          {session.title || 'Legal Research Session'}
                        </Text>
                        <Text style={styles.historyItemDate}>{dateStr}</Text>
                      </View>
                      {lastMsg ? (
                        <Text style={styles.historyItemSnippet} numberOfLines={2}>
                          {lastMsg}
                        </Text>
                      ) : null}
                      <View style={styles.historyItemMeta}>
                        <View style={styles.countPill}>
                          <Text style={styles.countPillText}>{msgCount} Messages</Text>
                        </View>
                        <Text style={styles.historyOpenAction}>Open in Chatbot →</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.historyActionsRow}>
                <TouchableOpacity
                  style={styles.openChatbotBtn}
                  onPress={() => navigation.navigate('Assistant')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.openChatbotBtnText}>💬 Open Chatbot</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.clearHistoryBtn}
                  onPress={handleClearHistory}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearHistoryBtnText}>🗑️ Clear History</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyHistoryCard}>
              <Text style={styles.emptyHistoryIcon}>📂</Text>
              <Text style={styles.emptyHistoryTitle}>No Saved History Yet</Text>
              <Text style={styles.emptyHistorySubtitle}>
                Legal research and questions you ask in the Chatbot will be saved here under your account.
              </Text>
              <TouchableOpacity
                style={styles.startInquiryBtn}
                onPress={() => navigation.navigate('Assistant')}
              >
                <Text style={styles.startInquiryBtnText}>+ Start Legal Inquiry</Text>
              </TouchableOpacity>
            </View>
          )}
            </>
          )}
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
              <Text style={styles.settingLabel}>Account Persistence</Text>
              <Text style={[styles.settingValue, { color: colors.success }]}>Active (Local + Cloud)</Text>
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
            <Text style={styles.actionBtnText}>
              {currentUser ? 'Sign In to Another Account' : 'Sign In to Advocate Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.actionBtnText}>Create New Advocate Profile</Text>
          </TouchableOpacity>

          {currentUser && (
            <TouchableOpacity
              style={styles.signOutBtn}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutBtnText}>Sign Out of Mobile App</Text>
            </TouchableOpacity>
          )}
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
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verifiedText: {
    color: colors.success,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userRole: {
    color: colors.gold,
    fontSize: 13,
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
    borderRadius: 8,
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  historyBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  historyBadgeText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  accountHintText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 12,
    lineHeight: 16,
  },
  highlightText: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  historyItemRow: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'flex-start',
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  historyItemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItemIcon: {
    fontSize: 16,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyItemTitle: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  historyItemDate: {
    color: colors.textMuted,
    fontSize: 10,
  },
  historyItemSnippet: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  historyItemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  countPillText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
  },
  historyOpenAction: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  historyActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    padding: 10,
    gap: 10,
  },
  openChatbotBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  openChatbotBtnText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  clearHistoryBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearHistoryBtnText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHistoryCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },
  emptyHistoryIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyHistoryTitle: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyHistorySubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  startInquiryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  startInquiryBtnText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '700',
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
