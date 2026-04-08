import React from 'react';
import { StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { Colors } from '../constants/colors';

interface GraphToggleProps {
  selected: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
}

export default function GraphToggle({
  selected,
  onChange,
  options = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ],
}: GraphToggleProps) {
  return (
    <SegmentedButtons
      value={selected}
      onValueChange={onChange}
      buttons={options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        style: [
          styles.button,
          selected === opt.value ? styles.activeButton : styles.inactiveButton,
        ],
        labelStyle: [
          styles.label,
          selected === opt.value ? styles.activeLabel : styles.inactiveLabel,
        ],
      }))}
      style={styles.container}
      density="small"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderRadius: 20,
    gap: 0,
  },
  button: {
    borderRadius: 17,
    borderWidth: 0,
    minWidth: 80,
  },
  activeButton: {
    backgroundColor: Colors.accent,
  },
  inactiveButton: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#0D1F0F',
  },
  inactiveLabel: {
    color: Colors.textMuted,
  },
});
