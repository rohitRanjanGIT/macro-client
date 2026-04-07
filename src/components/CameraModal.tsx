import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { Colors } from '../constants/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultState =
  | 'camera'
  | 'barcode'
  | 'package'
  | 'food_confident'
  | 'food_lowconf';

interface FoodItem {
  name: string;
  serving: string;
  calories: number;
}

interface GuessOption {
  name: string;
  serving: string;
  calories: number;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CloseIcon({ color = Colors.textMuted }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Polyline points="20 6 9 17 4 12" stroke={Colors.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RetakeIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M1 4v6h6" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke={Colors.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SearchIcon({ color = Colors.text }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function VoiceIcon({ color = Colors.text }: { color?: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M19 10v2a7 7 0 01-14 0v-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// ─── Sub-screens ──────────────────────────────────────────────────────────────

function StepBadge({ total, current, label }: { total: number; current: number; label: string }) {
  return (
    <View style={stepBadgeStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            stepBadgeStyles.dot,
            i + 1 === current ? stepBadgeStyles.dotActive : stepBadgeStyles.dotInactive,
          ]}
        />
      ))}
      <Text style={stepBadgeStyles.label}>{label}</Text>
    </View>
  );
}

const stepBadgeStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { backgroundColor: Colors.text },
  dotInactive: { backgroundColor: Colors.textMuted + '60' },
  label: { fontSize: 12, color: Colors.textMuted, marginLeft: 6, letterSpacing: 0.4 },
});

// ─── Camera View ─────────────────────────────────────────────────────────────

function CameraView({ onSnap, onClose }: { onSnap: () => void; onClose: () => void }) {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Camera</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Viewfinder */}
      <View style={styles.viewfinder}>
        {/* Corner brackets */}
        {[
          { top: 12, left: 12 },
          { top: 12, right: 12, transform: [{ scaleX: -1 }] },
          { bottom: 12, left: 12, transform: [{ scaleY: -1 }] },
          { bottom: 12, right: 12, transform: [{ scaleX: -1 }, { scaleY: -1 }] },
        ].map((pos, i) => (
          <View key={i} style={[styles.cornerBracket, pos]}>
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Path d="M2 10 V2 H10" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </View>
        ))}
        <Text style={styles.viewfinderHint}>Point at food, package, or barcode</Text>
      </View>

      {/* Snap button */}
      <TouchableOpacity style={styles.snapBtn} onPress={onSnap} activeOpacity={0.8}>
        <View style={styles.snapBtnInner} />
      </TouchableOpacity>

      <Text style={styles.snapHint}>Snap anything — we'll figure it out</Text>

      {/* Info footer */}
      <View style={styles.infoBox}>
        <Text style={styles.infoLine}><Text style={styles.infoBold}>No toggles.</Text> One camera, one button</Text>
        <Text style={styles.infoLine}><Text style={styles.infoBold}>Step 1:</Text> ML Kit checks for barcode</Text>
        <Text style={styles.infoLine}><Text style={styles.infoBold}>Step 2:</Text> if no barcode, Gemini analyzes</Text>
        <Text style={styles.infoLine}><Text style={styles.infoBold}>Gemini detects:</Text> food / package / label</Text>
      </View>
    </View>
  );
}

// ─── Barcode Result ───────────────────────────────────────────────────────────

function BarcodeResult({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const [servings, setServings] = useState(1);

  return (
    <View style={styles.screen}>
      <View style={styles.panelHeader}>
        <View style={styles.panelTitleRow}>
          <CheckIcon />
          <Text style={[styles.panelTitle, { marginLeft: 7 }]}>Barcode found</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Product card */}
      <View style={styles.productCard}>
        <View style={styles.productCardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>Britannia Good Day</Text>
            <Text style={styles.productSub}>Butter Cookies</Text>
            <Text style={styles.productSub}>Serving: 3 biscuits (30g)</Text>
            <Text style={styles.productMacros}>P 2g  C 18g  F 7g</Text>
          </View>
          <View style={styles.calBadge}>
            <Text style={styles.calNum}>142</Text>
            <Text style={styles.calLabel}>kcal</Text>
          </View>
        </View>

        {/* Servings */}
        <View style={styles.servingsRow}>
          <Text style={styles.servingsLabel}>Servings:</Text>
          <View style={styles.servingsStepper}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setServings(s => Math.max(1, s - 1))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepCount}>{servings}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setServings(s => s + 1)}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>Add to lunch</Text>
        </TouchableOpacity>
      </View>

      {/* Meta info */}
      <View style={styles.metaBox}>
        <Text style={styles.metaLine}>Auto-detected: <Text style={styles.metaBold}>barcode in image</Text></Text>
        <Text style={styles.metaLine}>Lookup: <Text style={styles.metaBold}>Open Food Facts API</Text></Text>
        <Text style={styles.metaLine}><Text style={styles.metaGreen}>No Gemini needed</Text> for this path</Text>
      </View>
    </View>
  );
}

// ─── Package Result ───────────────────────────────────────────────────────────

function PackageResult({ onClose, onAdd, onSearchManually }: {
  onClose: () => void;
  onAdd: () => void;
  onSearchManually: () => void;
}) {
  return (
    <View style={styles.screen}>
      <View style={styles.panelHeader}>
        <View style={styles.panelTitleRow}>
          <View style={styles.packageDot} />
          <Text style={[styles.panelTitle, { marginLeft: 8 }]}>Package detected</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Photo placeholder */}
      <View style={styles.photoPlaceholder}>
        <Text style={styles.photoPlaceholderText}>photo of Maggi packet</Text>
      </View>

      <Text style={styles.geminiLabel}>Gemini identified:</Text>
      <Text style={styles.productNameLg}>Maggi 2-Minute Masala Noodles</Text>

      <View style={styles.singleServingCard}>
        <View style={styles.productCardRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.servingText}>1 packet (70g)</Text>
            <Text style={styles.productMacros}>P 9g  C 42g  F 15g</Text>
          </View>
          <View style={styles.calBadge}>
            <Text style={styles.calNum}>313</Text>
            <Text style={styles.calLabel}>kcal</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onSearchManually} style={styles.searchManuallyRow}>
        <Text style={styles.searchManuallyPrefix}>Not right?  </Text>
        <Text style={styles.searchManuallyLink}>Search manually</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.85}>
        <Text style={styles.addBtnText}>Add to lunch</Text>
      </TouchableOpacity>

      {/* Meta */}
      <View style={[styles.metaBox, { marginTop: 14 }]}>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Gemini reads:</Text> brand + product name</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Match:</Text> against food DB / OFF API</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Bonus:</Text> can read nutrition label too</Text>
      </View>
    </View>
  );
}

// ─── Food Confident Result ────────────────────────────────────────────────────

function FoodConfidentResult({ onClose, onLog, onEdit }: {
  onClose: () => void;
  onLog: () => void;
  onEdit: () => void;
}) {
  const items: FoodItem[] = [
    { name: 'Jeera rice', serving: '1 katori (150g)', calories: 195 },
    { name: 'Dal fry', serving: '1 katori (200g)', calories: 170 },
    { name: 'Aloo gobi', serving: '1 katori (150g)', calories: 180 },
    { name: 'Roti', serving: '2 pcs (60g each)', calories: 240 },
  ];
  const total = items.reduce((s, i) => s + i.calories, 0);

  return (
    <View style={styles.screen}>
      <View style={styles.panelHeader}>
        <View style={styles.panelTitleRow}>
          <CheckIcon />
          <Text style={[styles.panelTitle, { marginLeft: 7 }]}>We found</Text>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Photo placeholder */}
      <View style={[styles.photoPlaceholder, { height: 90, marginBottom: 14 }]}>
        <Text style={styles.photoPlaceholderText}>photo of thali</Text>
      </View>

      {/* Food items list */}
      {items.map((item, i) => (
        <View key={i} style={styles.foodRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodServing}>{item.serving}</Text>
          </View>
          <Text style={styles.foodCal}>{item.calories}</Text>
        </View>
      ))}

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalCal}>{total} kcal</Text>
      </View>

      {/* Actions */}
      <View style={styles.twoButtonRow}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.8}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addBtn, styles.addBtnFlex]} onPress={onLog} activeOpacity={0.85}>
          <Text style={styles.addBtnText}>Log meal</Text>
        </TouchableOpacity>
      </View>

      {/* Meta */}
      <View style={[styles.metaBox, { marginTop: 14 }]}>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Multi-item:</Text> detects full thali</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Tap item:</Text> edit portion or swap</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Same UX</Text> as voice result screen</Text>
      </View>
    </View>
  );
}

// ─── Low Confidence Result ────────────────────────────────────────────────────

function LowConfResult({ onClose, onRetake, onSearch, onVoice, onSelect }: {
  onClose: () => void;
  onRetake: () => void;
  onSearch: () => void;
  onVoice: () => void;
  onSelect: (name: string) => void;
}) {
  const guesses: GuessOption[] = [
    { name: 'Dal makhani', serving: '1 katori (200g)', calories: 260 },
    { name: 'Rajma curry', serving: '1 katori (200g)', calories: 240 },
    { name: 'Chana masala', serving: '1 katori (200g)', calories: 210 },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Not quite sure</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Photo placeholder */}
      <View style={[styles.photoPlaceholder, { height: 90, marginBottom: 14 }]}>
        <Text style={styles.photoPlaceholderText}>photo of ambiguous curry</Text>
      </View>

      {/* Guess badge */}
      <View style={styles.guessBanner}>
        <Text style={styles.guessBannerText}>Could be one of these — tap to pick</Text>
      </View>

      {/* Options */}
      {guesses.map((g, i) => (
        <TouchableOpacity key={i} style={styles.guessRow} onPress={() => onSelect(g.name)} activeOpacity={0.75}>
          <View style={{ flex: 1 }}>
            <Text style={styles.foodName}>{g.name}</Text>
            <Text style={styles.foodServing}>{g.serving}</Text>
          </View>
          <Text style={styles.foodCal}>{g.calories} kcal</Text>
        </TouchableOpacity>
      ))}

      {/* Fallback row */}
      <View style={styles.fallbackRow}>
        <TouchableOpacity style={styles.fallbackBtn} onPress={onRetake} activeOpacity={0.8}>
          <RetakeIcon />
          <Text style={styles.fallbackBtnText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fallbackBtn} onPress={onSearch} activeOpacity={0.8}>
          <SearchIcon color={Colors.text} />
          <Text style={styles.fallbackBtnText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fallbackBtn} onPress={onVoice} activeOpacity={0.8}>
          <VoiceIcon color={Colors.text} />
          <Text style={styles.fallbackBtnText}>Voice</Text>
        </TouchableOpacity>
      </View>

      {/* Meta */}
      <View style={[styles.metaBox, { marginTop: 14 }]}>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Tap guess:</Text> selects + opens detail</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>3 fallbacks:</Text> retake, search, voice</Text>
        <Text style={styles.metaLine}><Text style={styles.metaBold}>Fail state:</Text> same but with "can't ID" msg</Text>
      </View>
    </View>
  );
}

// ─── CameraModal (root) ───────────────────────────────────────────────────────

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToMeal?: (name: string, calories: number) => void;
}

const DEMO_SEQUENCE: ResultState[] = [
  'barcode',
  'package',
  'food_confident',
  'food_lowconf',
];

const STATE_LABELS: Record<ResultState, string> = {
  camera: '1 / Camera (smart detect)',
  barcode: '2 / Result — barcode detected',
  package: '3 / Result — package detected',
  food_confident: '4 / Result — food (confident)',
  food_lowconf: '5 / Result — low confidence',
};

export default function CameraModal({ visible, onClose, onAddToMeal }: CameraModalProps) {
  const [resultState, setResultState] = useState<ResultState>('camera');
  const [demoIndex, setDemoIndex] = useState(0);

  function handleClose() {
    setResultState('camera');
    setDemoIndex(0);
    onClose();
  }

  function handleSnap() {
    // Cycle through demo states to showcase each result type
    const next = DEMO_SEQUENCE[demoIndex % DEMO_SEQUENCE.length];
    setResultState(next);
    setDemoIndex(i => i + 1);
  }

  function handleAdd(calories = 142) {
    onAddToMeal?.('Scanned food', calories);
    handleClose();
  }

  function handleRetake() {
    setResultState('camera');
  }

  const stepNum: Record<ResultState, number> = {
    camera: 1,
    barcode: 2,
    package: 3,
    food_confident: 4,
    food_lowconf: 5,
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <View style={styles.root}>
        {/* Step indicator bar */}
        <View style={styles.stepBar}>
          {(['camera', 'barcode', 'package', 'food_confident', 'food_lowconf'] as ResultState[]).map((s, i) => (
            <View
              key={s}
              style={[
                styles.stepSegment,
                s === resultState ? styles.stepSegmentActive : styles.stepSegmentInactive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.stepLabel}>{STATE_LABELS[resultState]}</Text>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {resultState === 'camera' && (
            <CameraView onSnap={handleSnap} onClose={handleClose} />
          )}
          {resultState === 'barcode' && (
            <BarcodeResult onClose={handleClose} onAdd={() => handleAdd(142)} />
          )}
          {resultState === 'package' && (
            <PackageResult
              onClose={handleClose}
              onAdd={() => handleAdd(313)}
              onSearchManually={() => handleClose()}
            />
          )}
          {resultState === 'food_confident' && (
            <FoodConfidentResult
              onClose={handleClose}
              onLog={() => handleAdd(785)}
              onEdit={() => {}}
            />
          )}
          {resultState === 'food_lowconf' && (
            <LowConfResult
              onClose={handleClose}
              onRetake={handleRetake}
              onSearch={handleClose}
              onVoice={handleClose}
              onSelect={(name) => handleAdd(250)}
            />
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepBar: {
    flexDirection: 'row',
    gap: 4,
    padding: 16,
    paddingBottom: 6,
  },
  stepSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  stepSegmentActive: {
    backgroundColor: Colors.text,
  },
  stepSegmentInactive: {
    backgroundColor: Colors.textMuted + '40',
  },
  stepLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    paddingHorizontal: 16,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Panel
  screen: {
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    padding: 4,
  },

  // Camera view
  viewfinder: {
    backgroundColor: '#111122',
    borderRadius: 16,
    height: 220,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  cornerBracket: {
    position: 'absolute',
  },
  viewfinderHint: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  snapBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.textMuted + '50',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.textMuted + '80',
  },
  snapBtnInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.textSecondary,
  },
  snapHint: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Info box
  infoBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    gap: 5,
  },
  infoLine: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  infoBold: {
    color: Colors.text,
    fontWeight: '600',
  },

  // Product card
  productCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  productCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  productNameLg: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  productSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  productMacros: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 5,
  },
  calBadge: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  calNum: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 30,
  },
  calLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  // Servings
  servingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  servingsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  servingsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  stepBtnText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
  },
  stepCount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },

  // Buttons
  addBtn: {
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnFlex: {
    flex: 1,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.background,
  },

  // Meta box
  metaBox: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  metaLine: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  metaBold: {
    color: Colors.text,
    fontWeight: '600',
  },
  metaGreen: {
    color: Colors.accent,
    fontWeight: '600',
  },

  // Package
  packageDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  photoPlaceholder: {
    backgroundColor: '#1C1C30',
    borderRadius: 12,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  geminiLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  singleServingCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  servingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  searchManuallyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchManuallyPrefix: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  searchManuallyLink: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // Food list
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  foodServing: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  foodCal: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  totalCal: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  twoButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 0.45,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },

  // Low confidence
  guessBanner: {
    backgroundColor: '#7C5F0020',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C49A2060',
  },
  guessBannerText: {
    fontSize: 13,
    color: '#C49A20',
    fontWeight: '500',
  },
  guessRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '40',
  },
  fallbackRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  fallbackBtn: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fallbackBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
});
