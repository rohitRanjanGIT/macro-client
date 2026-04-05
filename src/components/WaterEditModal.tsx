import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface WaterEditModalProps {
  visible: boolean;
  onClose: () => void;
  glasses: number;
  onSetGlasses: (count: number) => void;
}

const GOAL = 8;

export default function WaterEditModal({ visible, onClose, glasses, onSetGlasses }: WaterEditModalProps) {
  const mlPerGlass = 250;
  const totalMl = glasses * mlPerGlass;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Water Intake</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="#3B82F630"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.totalValue}>{totalMl} ml</Text>
            <Text style={styles.totalGoal}> / {GOAL * mlPerGlass} ml</Text>
          </View>

          {/* Glass grid */}
          <View style={styles.glassGrid}>
            {Array.from({ length: GOAL }, (_, i) => {
              const filled = i < glasses;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.glassItem, filled && styles.glassItemFilled]}
                  onPress={() => onSetGlasses(filled && glasses === i + 1 ? i : i + 1)}
                  activeOpacity={0.7}
                >
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z"
                      stroke={filled ? '#3B82F6' : Colors.textMuted}
                      strokeWidth="1.8"
                      fill={filled ? '#3B82F640' : 'none'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={[styles.glassLabel, filled && styles.glassLabelFilled]}>
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* +/- buttons */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlBtn, glasses <= 0 && styles.controlBtnDisabled]}
              onPress={() => glasses > 0 && onSetGlasses(glasses - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.controlBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.controlCount}>{glasses} glasses</Text>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => onSetGlasses(glasses + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.controlBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    fontSize: 18,
    color: Colors.textMuted,
    padding: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
    marginLeft: 8,
  },
  totalGoal: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  glassGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  glassItem: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassItemFilled: {
    backgroundColor: '#3B82F615',
    borderWidth: 1,
    borderColor: '#3B82F640',
  },
  glassLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  glassLabelFilled: {
    color: '#3B82F6',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnDisabled: {
    opacity: 0.4,
  },
  controlBtnText: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  controlCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
});
