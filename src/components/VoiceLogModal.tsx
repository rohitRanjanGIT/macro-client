import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface ParsedItem {
  name: string;
  serving: string;
  calories: number;
}

interface VoiceLogModalProps {
  visible: boolean;
  onClose: () => void;
  transcript: string;
  parsedItems: ParsedItem[];
  onLogMeal: () => void;
  onEditItems: () => void;
}

export default function VoiceLogModal({
  visible,
  onClose,
  transcript,
  parsedItems,
  onLogMeal,
  onEditItems,
}: VoiceLogModalProps) {
  const total = parsedItems.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Voice log</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Transcript bubble */}
          <View style={styles.transcriptCard}>
            <View style={styles.transcriptHeader}>
              <View style={styles.micIcon}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                    stroke={Colors.accent}
                    strokeWidth="2"
                  />
                  <Path d="M19 10v2a7 7 0 01-14 0v-2" stroke={Colors.accent} strokeWidth="2" />
                  <Line x1="12" y1="19" x2="12" y2="23" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </View>
              <Text style={styles.youSaid}>You said:</Text>
            </View>
            <Text style={styles.transcript}>"{transcript}"</Text>
          </View>

          {/* Parsed items */}
          <Text style={styles.sectionLabel}>WE PARSED THIS AS</Text>

          {parsedItems.map((item, index) => (
            <View key={index} style={styles.parsedRow}>
              <View style={styles.parsedDot} />
              <View style={styles.parsedInfo}>
                <Text style={styles.parsedName}>{item.name}</Text>
                <Text style={styles.parsedServing}>{item.serving}</Text>
              </View>
              <View style={styles.parsedRight}>
                <Text style={styles.parsedCal}>{item.calories}</Text>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M6 9l6 6 6-6" stroke={Colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
            </View>
          ))}

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total for this meal</Text>
            <Text style={styles.totalValue}>{total} kcal</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editBtn} onPress={onEditItems} activeOpacity={0.7}>
              <Text style={styles.editBtnText}>Edit items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logBtn} onPress={onLogMeal} activeOpacity={0.7}>
              <Text style={styles.logBtnText}>Log meal</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Tap any item to adjust portion or swap</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.textMuted,
    padding: 4,
  },
  transcriptCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  micIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youSaid: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  transcript: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 16,
  },
  parsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  parsedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    marginRight: 12,
  },
  parsedInfo: {
    flex: 1,
  },
  parsedName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  parsedServing: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  parsedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  parsedCal: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.accent + '12',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.accent,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  logBtn: {
    flex: 1.2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.accent + '18',
    alignItems: 'center',
  },
  logBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.accent,
  },
  hint: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
