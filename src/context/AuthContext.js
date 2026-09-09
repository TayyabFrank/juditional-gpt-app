import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Deterministic ID generator so the same email or role always accesses the same persistent chat history
function getDeterministicUserId(emailOrRole) {
  if (!emailOrRole) return 'adv-tayyab-786';
  const clean = emailOrRole.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `usr_${clean}`;
}

const DEFAULT_USER = {
  uid: 'adv-tayyab-786',
  name: 'Advocate Tayyab',
  email: 'tayyab.advocate@judicialgpt.pk',
  role: 'Advocate High Court',
  barCouncilNumber: 'BC-2022-LHR-4981',
  avatar: null
};

function getInitialUser() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem('judicialgpt_active_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          // Ensure uid is deterministic
          if (!parsed.uid || parsed.uid.startsWith('user-') || parsed.uid.startsWith('demo-') || parsed.uid.startsWith('guest-')) {
            parsed.uid = getDeterministicUserId(parsed.email);
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[AuthContext] Error reading saved user:', e);
    }
  }
  // No default login user; every user must sign up or sign in with their personal ID
  return null;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authNotification, setAuthNotification] = useState(null);

  // Synchronize active user with localStorage whenever currentUser changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (currentUser) {
          window.localStorage.setItem('judicialgpt_active_user', JSON.stringify(currentUser));
        } else {
          window.localStorage.removeItem('judicialgpt_active_user');
        }
      } catch (e) {
        console.warn('[AuthContext] Error saving user to storage:', e);
      }
    }
  }, [currentUser]);

  const showNotification = (message, type = 'success') => {
    setAuthNotification({ message, type });
    setTimeout(() => {
      setAuthNotification(null);
    }, 3500);
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const deterministicId = getDeterministicUserId(cleanEmail);
        const namePart = cleanEmail.split('@')[0] || 'Advocate Member';
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const user = {
          uid: deterministicId,
          name: displayName,
          email: cleanEmail,
          role: 'Advocate High Court',
          barCouncilNumber: 'BC-2023-ISB-1102'
        };
        setCurrentUser(user);
        setIsLoadingAuth(false);
        showNotification(`Signed in as ${user.name}! Previous chat history restored.`, 'success');
        resolve(user);
      }, 400);
    });
  };

  const signup = async (name, email, password, role = 'Advocate High Court') => {
    setIsLoadingAuth(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = (email || '').trim().toLowerCase();
        const deterministicId = getDeterministicUserId(cleanEmail);
        const user = {
          uid: deterministicId,
          name: name.trim() || 'Advocate Member',
          email: cleanEmail,
          role: role || 'Advocate High Court',
          barCouncilNumber: 'BC-' + Math.floor(1000 + Math.random() * 9000)
        };
        setCurrentUser(user);
        setIsLoadingAuth(false);
        showNotification('Advocate account created and synced!', 'success');
        resolve(user);
      }, 400);
    });
  };

  const loginAsDemo = (role = 'Advocate High Court') => {
    const isJudge = role.includes('Judge');
    const demoEmail = isJudge ? 'judge.tayyab@judicialgpt.pk' : 'tayyab.advocate@judicialgpt.pk';
    const demoUser = {
      uid: isJudge ? 'usr_judge_tayyab' : 'adv-tayyab-786',
      name: isJudge ? 'Justice Tayyab (Retd.)' : 'Advocate Tayyab',
      email: demoEmail,
      role: role,
      barCouncilNumber: isJudge ? 'SC-BENCH-409' : 'BC-2022-LHR-4981'
    };
    setCurrentUser(demoUser);
    showNotification(`Active profile: ${demoUser.name} (${role})`, 'success');
    return demoUser;
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'usr_guest_jurist',
      name: 'Guest Jurist',
      email: 'guest@judicialgpt.pk',
      role: 'Legal Researcher',
      barCouncilNumber: 'GUEST-ACCESS'
    };
    setCurrentUser(guestUser);
    showNotification('Welcome! Logged in as Guest', 'info');
    return guestUser;
  };

  const logout = async () => {
    setCurrentUser(null);
    showNotification('Signed out from account', 'info');
  };

  const updateProfile = (updates) => {
    if (currentUser) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
      showNotification('Profile updated successfully', 'success');
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoadingAuth,
    authNotification,
    login,
    signup,
    loginAsDemo,
    loginAsGuest,
    logout,
    updateProfile,
    showNotification
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

