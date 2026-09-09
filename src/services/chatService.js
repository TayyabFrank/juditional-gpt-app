/**
 * JudicialGPT Mobile - Chat Session & History Service
 * Manages user sessions, real-time message streams, and per-account persistence
 */

const DEFAULT_SESSIONS = [
  {
    id: 'session-demo-1',
    title: 'Bail Petition under S.497 CrPC',
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Principles for grant of post-arrest bail under Section 497 CrPC',
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'm2',
        sender: 'ai',
        text: 'In post-arrest bail petitions under Section 497 of the Code of Criminal Procedure 1898, the Supreme Court of Pakistan has consistently held that liberty of a citizen is a precious fundamental right guaranteed under Articles 4 and 9 of the Constitution. Where reasonable grounds do not appear for believing the accused guilty of an offence punishable with death or imprisonment for life, bail is granted as a matter of rule and refusal is an exception.',
        citations: ['PLD 2022 SC 142', '2020 SCMR 249', 'Section 497, Cr.P.C.'],
        timestamp: new Date(Date.now() - 3550000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  },
  {
    id: 'session-demo-2',
    title: 'Specific Performance of Contract',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'Can a court decree specific performance of agreement to sell?',
        timestamp: new Date(Date.now() - 86400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'm4',
        sender: 'ai',
        text: 'Under Pakistani law, breach of contract is governed by the Contract Act 1872 and Specific Relief Act 1877. Under Sections 12 and 19 of the Specific Relief Act 1877, courts grant decrees of specific performance where pecuniary compensation cannot afford adequate relief, particularly in transactions concerning immovable property.',
        citations: ['PLD 2023 SC 145', 'Section 73 Contract Act 1872', 'Specific Relief Act 1877'],
        timestamp: new Date(Date.now() - 86350000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  }
];

// In-memory fallback per user account
const memoryStore = {};

function getStorageKey(userId) {
  const safeId = (userId || 'adv-tayyab-786').replace(/[^a-zA-Z0-9_-]/g, '_');
  return `judicialgpt_user_chats_${safeId}`;
}

function getStoredSessions(userId) {
  const key = getStorageKey(userId);
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ChatService] Error reading localStorage:', e);
    }
  }

  if (memoryStore[key] && Array.isArray(memoryStore[key]) && memoryStore[key].length > 0) {
    return memoryStore[key];
  }

  // Initialize with default template sessions for the account
  const initial = JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
  saveStoredSessions(userId, initial);
  return initial;
}

function saveStoredSessions(userId, sessions) {
  const key = getStorageKey(userId);
  memoryStore[key] = sessions;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(sessions));
    } catch (e) {
      console.warn('[ChatService] Error writing localStorage:', e);
    }
  }
}

export async function getUserChatSessions(userId) {
  return getStoredSessions(userId);
}

export async function createChatSession(userId, title) {
  const sessions = getStoredSessions(userId);
  const newSession = {
    id: 'session-' + Date.now(),
    title: title || 'New Legal Inquiry',
    createdAt: new Date().toISOString(),
    messages: []
  };
  const updated = [newSession, ...sessions];
  saveStoredSessions(userId, updated);
  return newSession;
}

export async function deleteChatSession(userId, sessionId) {
  const sessions = getStoredSessions(userId);
  const updated = sessions.filter(s => s.id !== sessionId);
  saveStoredSessions(userId, updated);
  return true;
}

export async function getChatMessages(userId, sessionId) {
  const sessions = getStoredSessions(userId);
  const session = sessions.find(s => s.id === sessionId);
  return session ? [...session.messages] : [];
}

export async function addMessageToChat(userId, sessionId, message) {
  const sessions = getStoredSessions(userId);
  const formattedMsg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    ...message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex >= 0) {
    sessions[sessionIndex].messages.push(formattedMsg);
    // Update title if it was the first user message
    if (sessions[sessionIndex].title === 'New Legal Inquiry' && message.sender === 'user') {
      sessions[sessionIndex].title = message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text;
    }
  } else {
    // Session didn't exist, create it with this message
    const newSession = {
      id: sessionId || 'session-' + Date.now(),
      title: message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text,
      createdAt: new Date().toISOString(),
      messages: [formattedMsg]
    };
    sessions.unshift(newSession);
  }

  saveStoredSessions(userId, sessions);
  return formattedMsg;
}
