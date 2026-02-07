import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const BasicInfoBirthdayPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BasicInfoBirthdayPage</Text>
      <Text style={styles.description}>生日選擇頁面</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
});
