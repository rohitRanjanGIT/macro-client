import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface AddMealButtonProps {
  label: string;
  onPress?: () => void;
  onVoicePress?: () => void;
  onCameraPress?: () => void;
}

export default function AddMealButton({ label, onPress, onVoicePress, onCameraPress }: AddMealButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addArea} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.plus}>+</Text>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickBtn} onPress={onVoicePress} activeOpacity={0.7}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
              stroke={Colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19 10v2a7 7 0 01-14 0v-2"
              stroke={Colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line x1="12" y1="19" x2="12" y2="23" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={onCameraPress} activeOpacity={0.7}>
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
              stroke={Colors.accent}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="13" r="4" stroke={Colors.accent} strokeWidth="2" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  addArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  plus: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  label: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 8,
  },
  quickBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
