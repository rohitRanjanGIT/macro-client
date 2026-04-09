import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { TabKey, TABS } from './types';

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <View style={styles.row}>
      {TABS.map(t => (
        <TouchableOpacity
          key={t.key}
          style={[styles.tab, active === t.key && styles.tabActive]}
          onPress={() => onChange(t.key)}
          activeOpacity={0.75}
        >
          <Text style={[styles.text, active === t.key && styles.textActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  textActive: {
    color: Colors.text,
    fontWeight: '600',
  },
});
