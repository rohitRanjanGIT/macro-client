import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { SavedCombo } from '../../context/ComboContext';

interface ComboCardProps {
  combo: SavedCombo;
  onLongPress: () => void;
}

export default function ComboCard({ combo, onLongPress }: ComboCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onLongPress={onLongPress} delayLongPress={400}>
      <View style={styles.header}>
        <View style={[styles.colorDot, { backgroundColor: combo.color }]} />
        <Text style={styles.name} numberOfLines={1}>{combo.name}</Text>
        <View style={styles.calBadge}>
          <Text style={styles.calNum}>{combo.calories}</Text>
          <Text style={styles.calUnit}>kcal</Text>
        </View>
      </View>

      <Text style={styles.macros}>
        P {combo.protein}g    C {combo.carbs}g    F {combo.fat}g
      </Text>

      <View style={styles.itemList}>
        {combo.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemDot}>·</Text>
            <Text style={styles.itemText} numberOfLines={1}>
              {item.servings > 1 ? `${item.servings}× ` : ''}{item.name}
            </Text>
            <Text style={styles.itemCal}>{Math.round(item.calories * item.servings)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tagRow}>
        {combo.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.tag}>
          <Text style={styles.tagText}>{combo.items.length} items</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  calNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  calUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  macros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 10,
    marginLeft: 18,
  },
  itemList: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  itemDot: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  itemText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  itemCal: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
