import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import AssistantScreen from '../screens/Assistant/AssistantScreen';
import AiToolsScreen from '../screens/AiTools/AiToolsScreen';
import FeaturesScreen from '../screens/Features/FeaturesScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

export default function AppNavigator() {
  // Navigation stack state
  const [currentStack, setCurrentStack] = useState('Main'); // 'Main' | 'Login' | 'Signup' | 'ForgotPassword'
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Tools' | 'Assistant' | 'Features' | 'Profile'
  const [assistantParams, setAssistantParams] = useState(null);

  // Custom navigation controller
  const navigation = {
    navigate: (screen, params) => {
      if (screen === 'AssistantTab') {
        setActiveTab('Assistant');
        setCurrentStack('Main');
        if (params) setAssistantParams(params);
      } else if (screen === 'HomeTab') {
        setActiveTab('Home');
        setCurrentStack('Main');
      } else if (screen === 'ToolsTab') {
        setActiveTab('Tools');
        setCurrentStack('Main');
      } else if (screen === 'FeaturesTab') {
        setActiveTab('Features');
        setCurrentStack('Main');
      } else if (screen === 'ProfileTab') {
        setActiveTab('Profile');
        setCurrentStack('Main');
      } else if (screen === 'Login') {
        setCurrentStack('Login');
      } else if (screen === 'Signup') {
        setCurrentStack('Signup');
      } else if (screen === 'ForgotPassword') {
        setCurrentStack('ForgotPassword');
      } else if (screen === 'MainTabs') {
        setCurrentStack('Main');
      }
    },
    goBack: () => {
      setCurrentStack('Main');
    }
  };

  // Render Stack screens if not in Main Tabs
  if (currentStack === 'Login') {
    return <LoginScreen navigation={navigation} />;
  }
  if (currentStack === 'Signup') {
    return <SignupScreen navigation={navigation} />;
  }
  if (currentStack === 'ForgotPassword') {
    return <ForgotPasswordScreen navigation={navigation} />;
  }

  // Active Tab View
  const renderActiveTabScreen = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen navigation={navigation} />;
      case 'Tools':
        return <AiToolsScreen navigation={navigation} />;
      case 'Assistant':
        return <AssistantScreen navigation={navigation} route={{ params: assistantParams }} />;
      case 'Features':
        return <FeaturesScreen navigation={navigation} />;
      case 'Profile':
        return <ProfileScreen navigation={navigation} />;
      default:
        return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Active Screen */}
      <View style={styles.screenContainer}>
        {renderActiveTabScreen()}
      </View>

      {/* Bottom Navigation Tab Bar */}
      <SafeAreaView style={styles.tabBarSafeArea}>
        <View style={styles.tabBar}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={[styles.tabIcon, activeTab === 'Home' && styles.tabIconActive]}>🏛️</Text>
            <Text style={[styles.tabLabel, activeTab === 'Home' && styles.tabLabelActive]}>Home</Text>
          </TouchableOpacity>

          {/* AI Tools Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('Tools')}
          >
            <Text style={[styles.tabIcon, activeTab === 'Tools' && styles.tabIconActive]}>⚖️</Text>
            <Text style={[styles.tabLabel, activeTab === 'Tools' && styles.tabLabelActive]}>AI Tools</Text>
          </TouchableOpacity>

          {/* Center Elevated Assistant Tab */}
          <TouchableOpacity
            style={styles.centerTabItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('Assistant')}
          >
            <View style={[styles.centerTabBadge, activeTab === 'Assistant' && styles.centerTabBadgeActive]}>
              <Text style={styles.centerTabIcon}>💬</Text>
            </View>
            <Text style={[styles.centerTabLabel, activeTab === 'Assistant' && styles.tabLabelActive]}>
              Copilot
            </Text>
          </TouchableOpacity>

          {/* Features Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('Features')}
          >
            <Text style={[styles.tabIcon, activeTab === 'Features' && styles.tabIconActive]}>📚</Text>
            <Text style={[styles.tabLabel, activeTab === 'Features' && styles.tabLabelActive]}>Features</Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('Profile')}
          >
            <Text style={[styles.tabIcon, activeTab === 'Profile' && styles.tabIconActive]}>👤</Text>
            <Text style={[styles.tabLabel, activeTab === 'Profile' && styles.tabLabelActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBarSafeArea: {
    backgroundColor: colors.cardBg,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 62,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.6,
    marginBottom: 3,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  centerTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerTabBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBgElevated,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  centerTabBadgeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  centerTabIcon: {
    fontSize: 22,
  },
  centerTabLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  }
});
