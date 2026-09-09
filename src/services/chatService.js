/**
 * JudicialGPT Mobile - Chat Session & History Service
 * Manages user sessions, real-time message streams, and local state persistence
 */

// In-memory persistent cache for mobile sessions
let localSessions = [
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

export async function getUserChatSessions(_userId) {
  return [...localSessions];
}

export async function createChatSession(_userId, title) {
  const newSession = {
    id: 'session-' + Date.now(),
    title: title || 'New Legal Inquiry',
    createdAt: new Date().toISOString(),
    messages: []
  };
  localSessions = [newSession, ...localSessions];
  return newSession;
}

export async function deleteChatSession(_userId, sessionId) {
  localSessions = localSessions.filter(s => s.id !== sessionId);
  return true;
}

export async function getChatMessages(_userId, sessionId) {
  const session = localSessions.find(s => s.id === sessionId);
  return session ? [...session.messages] : [];
}

export async function addMessageToChat(_userId, sessionId, message) {
  const sessionIndex = localSessions.findIndex(s => s.id === sessionId);
  const formattedMsg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    ...message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (sessionIndex >= 0) {
    localSessions[sessionIndex].messages.push(formattedMsg);
  } else {
    // If session doesn't exist, create one
    const newSession = {
      id: sessionId || 'session-' + Date.now(),
      title: message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text,
      createdAt: new Date().toISOString(),
      messages: [formattedMsg]
    };
    localSessions = [newSession, ...localSessions];
  }

  return formattedMsg;
}
