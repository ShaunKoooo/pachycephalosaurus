import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export const LoginFooter: React.FC = () => {
  const handleReportIssue = () => {
    // TODO: 導航到問題回報頁面
    console.log('問題回報');
  };

  const handleEULA = () => {
    Linking.openURL('https://cofit.me/eula');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://cofit.me/privacy');
  };

  const handleCheckUpdate = () => {
    // TODO: 檢查更新邏輯
    console.log('檢查程式更新');
  };

  return (
    <View style={styles.container}>
      {/* 問題回報 */}
      <TouchableOpacity style={styles.reportButton} onPress={handleReportIssue}>
        <Text style={styles.reportIcon}>⚠️</Text>
        <Text style={styles.reportText}>問題回報</Text>
      </TouchableOpacity>

      {/* 條款連結 */}
      <View style={styles.linksContainer}>
        <Text style={styles.hintText}>繼續進行即表示您同意 </Text>
        <TouchableOpacity onPress={handleEULA}>
          <Text style={styles.link}>使用者條款 (EULA)</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>、</Text>
        <TouchableOpacity onPress={handlePrivacy}>
          <Text style={styles.link}>隱私權政策</Text>
        </TouchableOpacity>
      </View>

      {/* 版本號 */}
      <TouchableOpacity onPress={handleCheckUpdate}>
        <Text style={styles.version}>v6.9.0-2026020303- 檢查程式更新</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportIcon: {
    fontSize: 16,
  },
  reportText: {
    color: '#000000',
    fontSize: 14,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    color: '#999',
    fontSize: 12,
  },
  link: {
    color: '#4A9EFF',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  version: {
    color: '#666',
    fontSize: 11,
  },
});
