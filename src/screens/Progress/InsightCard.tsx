import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface InsightCardProps {
  type?: 'warning' | 'tip' | 'success';
  icon: string;
  title: string;
  subtitle: string;
}

export default function InsightCard({ type = 'tip', icon, title, subtitle }: InsightCardProps) {
  const getTheme = () => {
    switch (type) {
      case 'warning':
        return {
          bg: '#FF3B3012',
          border: '#FF3B3040',
          iconBg: '#FF3B3025',
          iconText: '#FF453A',
        };
      case 'success':
        return {
          bg: '#34C75912',
          border: '#34C75940',
          iconBg: '#34C75925',
          iconText: '#30D158',
        };
      case 'tip':
      default:
        return {
          bg: '#0A84FF15',
          border: '#0A84FF40',
          iconBg: '#0A84FF25',
          iconText: '#5E5CE6', // elegant purple/blue for tip
        };
    }
  };
  const theme = getTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={styles.header}>
        <View style={styles.leftRow}>
          <View style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={[styles.tagText, { color: theme.iconText }]}>
            {type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: '500',
  },
});
