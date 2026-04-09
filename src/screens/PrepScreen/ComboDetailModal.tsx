import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { SavedCombo } from '../../context/ComboContext';

interface ComboDetailModalProps {
  combo: SavedCombo | null;
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ComboDetailModal({ combo, visible, onClose, onEdit, onDelete }: ComboDetailModalProps) {
  if (!combo) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header with actions */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeCircle}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={Colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={Colors.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <View style={[styles.colorDot, { backgroundColor: combo.color }]} />
            <Text style={styles.title}>{combo.name}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            {combo.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Nutrition total */}
          <Text style={styles.sectionLabel}>TOTAL NUTRITION</Text>
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionHeader}>
              <View>
                <Text style={styles.calBig}>{combo.calories}</Text>
                <Text style={styles.calLabel}>kcal total</Text>
              </View>
              <View style={styles.macroBadges}>
                {[
                  { label: 'P', val: combo.protein, color: Colors.calorieRingProtein },
                  { label: 'C', val: combo.carbs, color: Colors.calorieRingCarbs },
                  { label: 'F', val: combo.fat, color: Colors.calorieRingFat },
                ].map(m => (
                  <View key={m.label} style={[styles.macroBadge, { borderColor: m.color + '60' }]}>
                    <Text style={[styles.macroBadgeVal, { color: m.color }]}>{m.val}g</Text>
                    <Text style={styles.macroBadgeLbl}>{m.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Items */}
          <View style={styles.itemsHeader}>
            <Text style={styles.sectionLabel}>FOOD ITEMS</Text>
            <Text style={styles.itemCount}>{combo.items.length}</Text>
          </View>
          {combo.items.map((item) => {
            const itemCal = Math.round(item.calories * item.servings);
            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemServing}>
                    {item.servings > 1 ? `${item.servings}× ` : ''}{item.serving}
                  </Text>
                </View>
                <Text style={styles.itemCal}>{itemCal} kcal</Text>
              </View>
            );
          })}
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
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  closeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.accent + '15',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accent,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.danger + '15',
    borderWidth: 1,
    borderColor: Colors.danger + '40',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 4,
  },
  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border + '50',
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calBig: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  calLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  macroBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  macroBadge: {
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 42,
  },
  macroBadgeVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  macroBadgeLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemCount: {
    fontSize: 12,
    color: Colors.textMuted,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border + '30',
  },
  itemName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemServing: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  itemCal: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
