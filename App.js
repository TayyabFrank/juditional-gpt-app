import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
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

