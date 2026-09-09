import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to a pre-authenticated demo advocate for immediate usability
  const [currentUser, setCurrentUser] = useState({
    uid: 'adv-tayyab-786',
    name: 'Advocate Tayyab',
    email: 'tayyab.advocate@judicialgpt.pk',
    role: 'Advocate High Court',
    barCouncilNumber: 'BC-2022-LHR-4981',
    avatar: null
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authNotification, setAuthNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setAuthNotification({ message, type });
    setTimeout(() => {
      setAuthNotification(null);
    }, 3500);
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    // Simulate login
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          uid: 'user-' + Date.now(),
          name: email.split('@')[0] || 'Advocate Member',
          email,
          role: 'Advocate High Court',
          barCouncilNumber: 'BC-2023-ISB-1102'
        };
        setCurrentUser(user);
        setIsLoadingAuth(false);
        showNotification('Signed in successfully!', 'success');
        resolve(user);
      }, 500);
    });
  };

  const signup = async (name, email, password, role = 'Advocate High Court') => {
    setIsLoadingAuth(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          uid: 'user-' + Date.now(),
          name,
          email,
          role: role || 'Advocate High Court',
          barCouncilNumber: 'BC-' + Math.floor(1000 + Math.random() * 9000)
        };
        setCurrentUser(user);
        setIsLoadingAuth(false);
        showNotification('Account created successfully!', 'success');
        resolve(user);
      }, 500);
    });
  };

  const loginAsDemo = (role = 'Advocate High Court') => {
    const demoUser = {
      uid: 'demo-' + Date.now(),
      name: role.includes('Judge') ? 'Justice Tayyab (Retd.)' : 'Advocate Tayyab',
      email: 'tayyab.demo@judicialgpt.pk',
      role: role,
      barCouncilNumber: 'LHC-ROLL-7890'
    };
    setCurrentUser(demoUser);
    showNotification(`Signed in as ${demoUser.name} (${role})`, 'success');
    return demoUser;
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'guest-' + Date.now(),
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
    showNotification('Signed out', 'info');
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
