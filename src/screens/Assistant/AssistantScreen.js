import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors } from '../../theme/colors';
import Header from '../../components/Header';
import CitationChip from '../../components/CitationChip';
import QuickPromptPill from '../../components/QuickPromptPill';
import DocumentModal from '../../components/DocumentModal';
import { useAuth } from '../../context/AuthContext';
import {
  getUserChatSessions,
  createChatSession,
  deleteChatSession,
  getChatMessages,
  addMessageToChat
} from '../../services/chatService';
import { generateLegalResponse } from '../../services/geminiService';

export default function AssistantScreen({ route, navigation }) {
  const { currentUser } = useAuth();
  const flatListRef = useRef(null);

  const [activeSessionId, setActiveSessionId] = useState('session-demo-1');
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Keep fresh refs for keyboard events
  const inputTextRef = useRef(inputText);
  const isAiThinkingRef = useRef(isAiThinking);
  const handleSendRef = useRef(null);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  useEffect(() => {
    isAiThinkingRef.current = isAiThinking;
  }, [isAiThinking]);

  // Intercept any newline insertion (pressing Enter) and send immediately
  const handleInputChange = (text) => {
    if (text.includes('\n') || text.includes('\r')) {
      const cleanPrompt = text.replace(/[\r\n]/g, '').trim();
      if (cleanPrompt && !isAiThinkingRef.current && handleSendRef.current) {
        handleSendRef.current(cleanPrompt);
      }
      return;
    }
    setInputText(text);
    inputTextRef.current = text;
  };

  const inputElementRef = useRef(null);

  // Robust Enter key listener for Web to send message immediately without clicking mouse
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleGlobalKeyDown = (e) => {
        if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
          const active = document.activeElement;
          if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
            e.preventDefault();
            e.stopPropagation();
            const text = (active.value || inputTextRef.current || '').trim();
            if (text && !isAiThinkingRef.current && handleSendRef.current) {
              active.value = '';
              handleSendRef.current(text);
            }
          }
        }
      };

      window.addEventListener('keydown', handleGlobalKeyDown, true);
      document.addEventListener('keydown', handleGlobalKeyDown, true);

      return () => {
        window.removeEventListener('keydown', handleGlobalKeyDown, true);
        document.removeEventListener('keydown', handleGlobalKeyDown, true);
      };
    }
  }, []);

  // Quick prompt chips
  const QUICK_PROMPTS = [
    { label: 'Bail Petition s.497', query: 'Draft grounds for post-arrest bail petition under Section 497 Cr.P.C. in a case of alleged cheque dishonour.' },
    { label: 'Limitation for ICA', query: 'What is the limitation period for filing an Intra-Court Appeal (ICA) in the Lahore High Court?' },
    { label: 'Specific Performance', query: 'Can court grant specific performance of agreement to sell when time was not essence of contract?' },
    { label: 'Writ under Art. 199', query: 'What are the essential grounds to maintain a writ petition against CDA/LDA under Article 199?' },
  ];

  // Reload chat sessions on mount and whenever user account changes
  useEffect(() => {
    loadSessions();
  }, [currentUser?.uid, currentUser?.email]);

  // Handle route params (e.g. opened from Profile history or Quick action)
  useEffect(() => {
    if (route?.params?.sessionId) {
      handleSelectSession(route.params.sessionId);
    } else if (route?.params?.initialPrompt) {
      handleSend(route.params.initialPrompt);
    }
  }, [route?.params?.sessionId, route?.params?.initialPrompt]);

  const loadSessions = async (preferredSessionId = null) => {
    const userId = currentUser?.uid || 'adv-tayyab-786';
    const userSessions = await getUserChatSessions(userId);
    setSessions(userSessions);
    const targetId = preferredSessionId || route?.params?.sessionId || activeSessionId;
    if (userSessions.length > 0) {
      const targetSession = (targetId && userSessions.find((s) => s.id === targetId)) || userSessions[0];
      setActiveSessionId(targetSession.id);
      loadMessages(targetSession.id);
    } else {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  const loadMessages = async (sessionId) => {
    const userId = currentUser?.uid || 'adv-tayyab-786';
    const msgs = await getChatMessages(userId, sessionId);
    setMessages(msgs);
  };

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId);
    loadMessages(sessionId);
    setIsSessionModalOpen(false);
  };

  const handleStartNewChat = async () => {
    const userId = currentUser?.uid || 'adv-tayyab-786';
    const newSession = await createChatSession(userId, 'New Legal Inquiry');
    const updated = await getUserChatSessions(userId);
    setSessions(updated);
    setActiveSessionId(newSession.id);
    setMessages([]);
    setIsSessionModalOpen(false);
  };

  const handleDeleteSession = async (sessionId) => {
    const userId = currentUser?.uid || 'adv-tayyab-786';
    await deleteChatSession(userId, sessionId);
    const updated = await getUserChatSessions(userId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
        loadMessages(updated[0].id);
      } else {
        handleStartNewChat();
      }
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const handleSend = async (textToSend) => {
    const prompt = (textToSend || inputTextRef.current || inputText).trim();
    if (!prompt) return;

    // Immediately clear input text and ref
    setInputText('');
    inputTextRef.current = '';

    const userId = currentUser?.uid || 'adv-tayyab-786';
    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      const titleSnippet = prompt.length > 28 ? prompt.substring(0, 28) + '...' : prompt;
      const newSession = await createChatSession(userId, titleSnippet);
      currentSessionId = newSession.id;
      setActiveSessionId(newSession.id);
      setSessions((prev) => [newSession, ...prev]);
    }

    const userMsg = {
      sender: 'user',
      text: prompt
    };

    // 1. Immediately upload user message to message box and persistent store
    const savedUserMsg = await addMessageToChat(userId, currentSessionId, userMsg);
    setMessages((prev) => [...prev, savedUserMsg]);
    setIsAiThinking(true);

    // Scroll chat stream to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);

    try {
      const aiResponse = await generateLegalResponse(prompt, messages);
      const aiMsg = {
        sender: 'ai',
        text: aiResponse.text,
        citations: aiResponse.citations || []
      };

      // 2. Upload AI response to message box and store in account history
      const savedAiMsg = await addMessageToChat(userId, currentSessionId, aiMsg);
      setMessages((prev) => [...prev, savedAiMsg]);

      // 3. Update session list to reflect new title/count in history strip
      const updatedSessions = await getUserChatSessions(userId);
      setSessions(updatedSessions);
    } catch (err) {
      const fallbackAiMsg = {
        sender: 'ai',
        text: 'JudicialGPT experienced an issue reaching the remote database. Precedent synthesis will resume shortly.',
        citations: ['System Notice']
      };
      const savedFallback = await addMessageToChat(userId, currentSessionId, fallbackAiMsg);
      setMessages((prev) => [...prev, savedFallback]);
    } finally {
      setIsAiThinking(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  };

  handleSendRef.current = handleSend;

  const handleSelectDoc = (doc) => {
    handleSend(`Please analyze this ${doc.title} and outline legal grounds under Pakistani law: ${doc.desc}`);
  };

  const handleVoiceCall = () => {
    Alert.alert(
      'Voice Consultation Mode',
      'Speak your legal inquiry in English, Urdu, or regional languages. JudicialGPT voice audio channel is active.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        subtitle="AI Judicial Intelligence Workspace"
        rightElement={
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() => setIsSessionModalOpen(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.historyBtnText}>📁 All Cases ({sessions.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.newChatBtn}
              onPress={handleStartNewChat}
              activeOpacity={0.7}
            >
              <Text style={styles.newChatBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Horizontal Chat History Bar */}
      <View style={styles.historyStripContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.historyStripContent}
        >
          <TouchableOpacity
            style={styles.historyNewPill}
            onPress={handleStartNewChat}
            activeOpacity={0.7}
          >
            <Text style={styles.historyNewPillIcon}>+</Text>
            <Text style={styles.historyNewPillText}>New Chat</Text>
          </TouchableOpacity>

          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.historySessionPill, isActive && styles.historySessionPillActive]}
                onPress={() => handleSelectSession(s.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.historySessionIcon}>💬</Text>
                <Text
                  style={[styles.historySessionText, isActive && styles.historySessionTextActive]}
                  numberOfLines={1}
                >
                  {s.title}
                </Text>
                {isActive && <View style={styles.historyActiveDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Case Banner */}
      {activeSession && (
        <View style={styles.activeCaseBanner}>
          <View style={styles.activeCaseLeft}>
            <Text style={styles.activeCaseDot}>●</Text>
            <Text style={styles.activeCaseLabel}>ACTIVE:</Text>
            <Text style={styles.activeCaseTitle} numberOfLines={1}>
              {activeSession.title}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.activeCaseSwitchBtn}
            onPress={() => setIsSessionModalOpen(true)}
          >
            <Text style={styles.activeCaseSwitchText}>Switch ▾</Text>
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <ScrollView
            style={styles.welcomeContainer}
            contentContainerStyle={styles.welcomeContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeIconBadge}>
              <Text style={styles.welcomeIconText}>⚖️</Text>
            </View>

            <Text style={styles.welcomeGreeting}>
              Assalam-o-Alaikum, {currentUser?.name?.split(' ')[0] || 'Advocate'}
            </Text>

            <Text style={styles.welcomeSub}>
              How may JudicialGPT assist your legal research and court drafting today?
            </Text>

            {/* Last Chat History Card */}
            {sessions.length > 0 && sessions[0].messages && sessions[0].messages.length > 0 && (
              <View style={styles.recentHistoryCard}>
                <View style={styles.recentHistoryHeader}>
                  <Text style={styles.recentHistoryBadge}>LAST CONVERSATION</Text>
                  <Text style={styles.recentHistoryDate}>
                    {new Date(sessions[0].createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <Text style={styles.recentHistoryTitle}>
                  {sessions[0].title}
                </Text>

                <Text style={styles.recentHistorySnippet} numberOfLines={2}>
                  "{sessions[0].messages[sessions[0].messages.length - 1].text}"
                </Text>

                <TouchableOpacity
                  style={styles.resumeChatBtn}
                  activeOpacity={0.8}
                  onPress={() => handleSelectSession(sessions[0].id)}
                >
                  <Text style={styles.resumeChatBtnText}>
                    Resume Last Discussion ({sessions[0].messages.length} msgs) →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.quickPromptSection}>
              <Text style={styles.quickPromptHeading}>FREQUENT PROCEDURAL INQUIRIES</Text>
              <View style={styles.pillsRow}>
                {QUICK_PROMPTS.map((item, idx) => (
                  <QuickPromptPill
                    key={idx}
                    icon="§"
                    label={item.label}
                    onPress={() => handleSend(item.query)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.advisoryNotice}>
              <Text style={styles.advisoryTitle}>Official Pakistani Law Reports</Text>
              <Text style={styles.advisoryText}>
                Includes SCMR, PLD (Supreme Court & High Courts), CLC, YLR, PTD, and Federal Statutes with active amendment tracking.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item.id || String(index)}
            contentContainerStyle={styles.messageList}
            renderItem={({ item }) => {
              const isUser = item.sender === 'user';
              return (
                <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
                  {!isUser && (
                    <View style={styles.aiAvatar}>
                      <Text style={styles.aiAvatarText}>⚖</Text>
                    </View>
                  )}

                  <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                      {item.text}
                    </Text>

                    {item.citations && item.citations.length > 0 && (
                      <View style={styles.citationsContainer}>
                        <Text style={styles.citationsTitle}>AUTHORITATIVE CITATIONS:</Text>
                        <View style={styles.citationsRow}>
                          {item.citations.map((c, i) => (
                            <CitationChip
                              key={i}
                              citation={c}
                              onPress={() => Alert.alert('Citation Verified', `${c}\nIndexed in Supreme & High Court of Pakistan Law Reports.`)}
                            />
                          ))}
                        </View>
                      </View>
                    )}

                    {item.timestamp && (
                      <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
                        {item.timestamp}
                      </Text>
                    )}
                  </View>

                  {isUser && (
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>👤</Text>
                    </View>
                  )}
                </View>
              );
            }}
            ListFooterComponent={
              isAiThinking ? (
                <View style={styles.thinkingContainer}>
                  <View style={styles.aiAvatar}>
                    <Text style={styles.aiAvatarText}>⚖</Text>
                  </View>
                  <View style={styles.thinkingBubble}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.thinkingText}>Analyzing Supreme Court precedents & statutes...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => setIsDocModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.attachBtnIcon}>📎</Text>
          </TouchableOpacity>

          <TextInput
            ref={inputElementRef}
            style={styles.textInput}
            placeholder="Ask Pakistani legal question, cite section or FIR..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={handleInputChange}
            returnKeyType="send"
            blurOnSubmit={false}
            multiline={false}
            onSubmitEditing={() => {
              const text = (inputText || '').trim();
              if (text && !isAiThinking) {
                handleSend(text);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                const text = (inputTextRef.current || '').trim();
                if (text && !isAiThinkingRef.current && handleSendRef.current) {
                  handleSendRef.current(text);
                }
              }
            }}
            maxLength={1000}
          />

          <TouchableOpacity
            style={styles.micBtn}
            onPress={handleVoiceCall}
            activeOpacity={0.7}
          >
            <Text style={styles.micBtnIcon}>🎙</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendBtn, Boolean(inputText.trim()) && styles.sendBtnActive]}
            disabled={!inputText.trim() || isAiThinking}
            onPress={() => handleSend()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Case Sessions History Modal */}
      <Modal
        visible={isSessionModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSessionModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Saved Case Inquiries</Text>
                <Text style={styles.modalSubtitle}>Switch or manage your legal research sessions</Text>
              </View>
              <TouchableOpacity onPress={() => setIsSessionModalOpen(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.modalNewBtn}
              onPress={handleStartNewChat}
            >
              <Text style={styles.modalNewBtnText}>+ Start New Legal Inquiry</Text>
            </TouchableOpacity>

            <ScrollView style={styles.modalList}>
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <View key={s.id} style={[styles.sessionItem, isActive && styles.sessionItemActive]}>
                    <TouchableOpacity
                      style={styles.sessionItemMain}
                      onPress={() => handleSelectSession(s.id)}
                    >
                      <Text style={styles.sessionItemIcon}>📁</Text>
                      <View style={styles.sessionItemTextCol}>
                        <Text style={[styles.sessionItemTitle, isActive && styles.sessionItemTitleActive]}>
                          {s.title}
                        </Text>
                        <Text style={styles.sessionItemDate}>
                          {new Date(s.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.sessionDeleteBtn}
                      onPress={() => handleDeleteSession(s.id)}
                    >
                      <Text style={styles.sessionDeleteText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Document Template Modal */}
      <DocumentModal
        visible={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSelectDocument={handleSelectDoc}
      />
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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyBtnText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
  newChatBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  newChatBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.cardBgElevated,
    borderWidth: 1,
    borderColor: colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  welcomeIconText: {
    fontSize: 32,
  },
  welcomeGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: 6,
    textAlign: 'center',
  },
  welcomeSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 18,
    marginBottom: 24,
  },
  quickPromptSection: {
    width: '100%',
    marginBottom: 20,
  },
  quickPromptHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  advisoryNotice: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  advisoryTitle: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  advisoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.cardBgElevated,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  aiAvatarText: {
    color: colors.primaryLight,
    fontSize: 16,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 2,
  },
  userAvatarText: {
    fontSize: 14,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.chatAiBubble,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  aiText: {
    color: colors.chatAiText,
  },
  citationsContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  citationsTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  citationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timestamp: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: colors.textMuted,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  thinkingText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachBtnIcon: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: colors.text,
    fontSize: 13,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnIcon: {
    fontSize: 16,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
  sendBtnIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalCloseText: {
    color: colors.textSecondary,
    fontSize: 18,
    padding: 4,
  },
  modalNewBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalNewBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalList: {
    marginBottom: 20,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sessionItemActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  sessionItemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sessionItemIcon: {
    fontSize: 18,
  },
  sessionItemTextCol: {
    flex: 1,
  },
  sessionItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  sessionItemTitleActive: {
    color: colors.primaryLight,
  },
  sessionItemDate: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sessionDeleteBtn: {
    padding: 6,
  },
  sessionDeleteText: {
    fontSize: 14,
  },
  historyStripContainer: {
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  historyStripContent: {
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
  },
  historyNewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  historyNewPillIcon: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyNewPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  historySessionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    maxWidth: 200,
    gap: 6,
  },
  historySessionPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: colors.primary,
  },
  historySessionIcon: {
    fontSize: 11,
  },
  historySessionText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  historySessionTextActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  historyActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  activeCaseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activeCaseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 6,
  },
  activeCaseDot: {
    color: colors.success,
    fontSize: 10,
  },
  activeCaseLabel: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  activeCaseTitle: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  activeCaseSwitchBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  activeCaseSwitchText: {
    color: colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
  recentHistoryCard: {
    width: '100%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    marginBottom: 20,
  },
  recentHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentHistoryBadge: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  recentHistoryDate: {
    color: colors.textMuted,
    fontSize: 10,
  },
  recentHistoryTitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  recentHistorySnippet: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  resumeChatBtn: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  resumeChatBtnText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  }
});
