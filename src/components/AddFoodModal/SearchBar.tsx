import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onCameraPress?: () => void;
  onVoicePress?: () => void;
}

export default function SearchBar({ value, onChangeText, onCameraPress, onVoicePress }: SearchBarProps) {
  return (
    <View style={styles.row}>
      <View style={styles.bar}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Circle cx="11" cy="11" r="7" stroke={Colors.textMuted} strokeWidth="2" />
          <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <TextInput
          style={styles.input}
          placeholder="Search food, recipe, combo..."
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
            <Text style={styles.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.quickBtn} onPress={onCameraPress} activeOpacity={0.7}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={Colors.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="12" cy="13" r="4" stroke={Colors.text} strokeWidth="1.8" />
        </Svg>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickBtn} onPress={onVoicePress} activeOpacity={0.7}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={Colors.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M19 10v2a7 7 0 01-14 0v-2" stroke={Colors.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <Line x1="12" y1="19" x2="12" y2="23" stroke={Colors.text} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  clear: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  quickBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
