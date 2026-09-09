import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View, Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = 'judicialgpt-sleek-scrollbars';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* Sleek Modern Dark Scrollbars */
          *::-webkit-scrollbar,
          ::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
          }
          *::-webkit-scrollbar-track,
          ::-webkit-scrollbar-track {
            background: #0f172a !important;
            border-radius: 8px !important;
          }
          *::-webkit-scrollbar-thumb,
          ::-webkit-scrollbar-thumb {
            background: #10b981 !important;
            background-image: linear-gradient(180deg, #10b981 0%, #059669 100%) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(16, 185, 129, 0.25) !important;
          }
          *::-webkit-scrollbar-thumb:hover,
          ::-webkit-scrollbar-thumb:hover {
            background: #34d399 !important;
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.7) !important;
          }
          *::-webkit-scrollbar-button,
          ::-webkit-scrollbar-button {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          * {
            scrollbar-width: thin !important;
            scrollbar-color: #10b981 #0f172a !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
          translucent={false}
        />
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colors.background,
  }
});

registerRootComponent(App);

