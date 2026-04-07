import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Animated, 
  Dimensions 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants/colors';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

function ChevronLeftIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CloseIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

const MOCK_FOOD = {
  name: 'Paneer Butter Masala',
  // Local placeholder image since we can't reliably load remote images without config/errors sometimes, or use a reliable one
  imageUri: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&q=80&w=400',
  baseCalories: 340,
  macros: { p: 14, c: 18, f: 24 }, // per serving
  ingredients: ['Paneer', 'Tomato puree', 'Butter', 'Cream', 'Cashew paste', 'Spices'],
};

const UNITS = ['katori', 'roti', 'glass', 'spoon', 'grams'];

export default function ScanScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'camera' | 'result' | 'loading'>('camera');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form states
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('katori');
  const [isRestaurant, setIsRestaurant] = useState(false);

  // Restart camera when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      setMode('camera');
      setShowConfirmation(false);
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = () => {
    // Fake capture delay
    setMode('loading');
    setTimeout(() => {
      setMode('result');
    }, 1200);
  };

  const handleAddLog = () => {
    setShowConfirmation(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.navigate('Home');
    }, 1000);
  };

  // Adjust calories based on restaurant vs homemade (restaurant usually has more oil/butter)
  const multiplier = (selectedUnit === 'grams' ? quantity / 150 : quantity); // 1 katori = ~150g
  const calMultiplier = isRestaurant ? 1.25 : 1;
  const currentCalories = Math.round(MOCK_FOOD.baseCalories * multiplier * calMultiplier);
  const p = Math.round(MOCK_FOOD.macros.p * multiplier);
  const c = Math.round(MOCK_FOOD.macros.c * multiplier * (isRestaurant ? 1.1 : 1));
  const f = Math.round(MOCK_FOOD.macros.f * multiplier * calMultiplier);

  if (mode === 'result') {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.resultScroll} contentContainerStyle={styles.resultContent}>
          {/* Header Actions */}
          <View style={styles.resultHeader}>
            <TouchableOpacity hitSlop={15} style={styles.iconBtn} onPress={() => setMode('camera')}>
              <ChevronLeftIcon />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={15} style={styles.iconBtn} onPress={() => navigation.navigate('Home')}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Image & Title */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: MOCK_FOOD.imageUri }} style={styles.foodImage} />
            <View style={styles.foodTitleBadge}>
              <Text style={styles.foodTitle}>{MOCK_FOOD.name}</Text>
            </View>
          </View>

          {/* Calories & Macros */}
          <View style={styles.nutritionCard}>
            <View style={styles.calRow}>
              <Text style={styles.calValue}>{currentCalories}</Text>
              <Text style={styles.calUnit}>kcal</Text>
            </View>
            <View style={styles.macroRow}>
              <View style={styles.macroCol}>
                <Text style={styles.macroValue}>{p}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroCol}>
                <Text style={styles.macroValue}>{c}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroDivider} />
              <View style={styles.macroCol}>
                <Text style={styles.macroValue}>{f}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>

          {/* Portion Selector */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Portion Size</Text>
            
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtBtn}
                onPress={() => setQuantity(Math.max(1, quantity - (selectedUnit === 'grams' ? 10 : 0.5)))}
              >
                <Text style={styles.qtBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtBtn}
                onPress={() => setQuantity(quantity + (selectedUnit === 'grams' ? 10 : 0.5))}
              >
                <Text style={styles.qtBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitScroll}>
              {UNITS.map(unit => (
                <TouchableOpacity
                  key={unit}
                  style={[styles.unitBadge, selectedUnit === unit && styles.unitBadgeActive]}
                  onPress={() => setSelectedUnit(unit)}
                >
                  <Text style={[styles.unitText, selectedUnit === unit && styles.unitTextActive]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Source Toggle */}
          <View style={styles.sectionCard}>
             <View style={styles.toggleRow}>
               <Text style={styles.sectionTitle}>Preparation</Text>
               <View style={styles.pillToggle}>
                 <TouchableOpacity 
                   style={[styles.togglePill, !isRestaurant && styles.togglePillActive]}
                   onPress={() => setIsRestaurant(false)}
                 >
                   <Text style={[styles.toggleText, !isRestaurant && styles.toggleTextActive]}>Homemade</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   style={[styles.togglePill, isRestaurant && styles.togglePillActive]}
                   onPress={() => setIsRestaurant(true)}
                 >
                   <Text style={[styles.toggleText, isRestaurant && styles.toggleTextActive]}>Restaurant</Text>
                 </TouchableOpacity>
               </View>
             </View>
             <Text style={styles.toggleHint}>Restaurant dishes typically use more oil/butter, which adds ~25% more calories.</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Detected Ingredients</Text>
            <View style={styles.ingredientsWrap}>
              {MOCK_FOOD.ingredients.map(ing => (
                <View key={ing} style={styles.ingredientBadge}>
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secBtn} onPress={() => setMode('camera')}>
              <Text style={styles.secBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleAddLog}>
              <Text style={styles.primaryBtnText}>Add to Log</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 40}}/>
        </ScrollView>

        {/* Confirmation Overlay */}
        {showConfirmation && (
          <Animated.View style={[styles.confirmationOverlay, { opacity: fadeAnim }]}>
            <View style={styles.confirmationBox}>
              <View style={styles.checkIconWrapper}>
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.confirmationText}>Added to today's log</Text>
            </View>
          </Animated.View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.cameraOverlay}>
          {/* Top Bar */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity hitSlop={15} style={styles.headerBtn} onPress={() => navigation.goBack()}>
              <ChevronLeftIcon />
            </TouchableOpacity>
          </View>

          {/* Focus Indicator */}
          <View style={styles.focusFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {mode === 'loading' && (
              <View style={styles.scanningWrap}>
                <Text style={styles.scanningText}>Analyzing food...</Text>
              </View>
            )}
          </View>

          {/* Bottom Controls */}
          <View style={styles.cameraFooter}>
            <TouchableOpacity 
              style={styles.captureBtnWrap} 
              onPress={handleCapture}
              disabled={mode === 'loading'}
            >
              <View style={styles.captureBtnOuter}>
                <View style={[styles.captureBtnInner, mode === 'loading' && styles.captureBtnInnerLoading]} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    color: Colors.text,
    fontSize: 16,
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionBtnText: {
    color: '#000',
    fontWeight: '700',
  },
  
  // Camera UI
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight dim outside focus
    justifyContent: 'space-between',
  },
  cameraHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusFrame: {
    alignSelf: 'center',
    width: width * 0.75,
    height: width * 0.75,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: 'white',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanningWrap: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanningText: {
    color: 'white',
    fontWeight: '600',
  },
  cameraFooter: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  captureBtnWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  captureBtnInnerLoading: {
    backgroundColor: Colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // Result UI
  resultScroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultContent: {
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodTitleBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  foodTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  nutritionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  calRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  calValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: Colors.accent,
    lineHeight: 64,
  },
  calUnit: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  macroRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  macroCol: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  macroLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  macroDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },

  sectionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  qtBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtBtnText: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: '500',
    marginTop: -2,
  },
  qtValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 30,
    minWidth: 40,
    textAlign: 'center',
  },
  unitScroll: {
    flexDirection: 'row',
  },
  unitBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.cardBackgroundLight,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitBadgeActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderColor: Colors.accent,
  },
  unitText: {
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  unitTextActive: {
    color: Colors.accent,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pillToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackgroundLight,
    borderRadius: 20,
    padding: 4,
  },
  togglePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  togglePillActive: {
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  toggleTextActive: {
    color: Colors.text,
  },
  toggleHint: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  ingredientsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ingredientBadge: {
    backgroundColor: Colors.cardBackgroundLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ingredientText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  secBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.cardBackgroundLight,
    alignItems: 'center',
  },
  secBtnText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  primaryBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  // Confirmation Overlay
  confirmationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  confirmationBox: {
    backgroundColor: Colors.cardBackground,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',
  },
  checkIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmationText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
