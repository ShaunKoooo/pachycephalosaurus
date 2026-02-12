import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontelloIcon } from '@/components';
import { Colors } from '@/theme';
import {
  FruitIcon,
  VegetablesIcon,
  GrainsIcon,
  MeatIcon,
  MilkIcon,
  OilIcon,
} from './svg';

interface FoodCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: FoodCategoryData) => void;
  photoUri?: string;
  mealLabel?: string;
}

export interface FoodCategoryData {
  fruit: number;
  vegetable: number;
  grain: number;
  protein: {
    lowFat: number;
    mediumFat: number;
    highFat: number;
    ultraHighFat: number;
  };
  dairy: {
    skimmed: number;
    lowFat: number;
    fullFat: number;
  };
  oil: number;
}

export default function FoodCategoryModal({
  visible,
  onClose,
  onSave,
  photoUri,
  mealLabel,
}: FoodCategoryModalProps) {
  const [fruitServings, setFruitServings] = useState('');
  const [vegetableServings, setVegetableServings] = useState('');
  const [grainServings, setGrainServings] = useState('');
  const [proteinLowFat, setProteinLowFat] = useState('');
  const [proteinMediumFat, setProteinMediumFat] = useState('');
  const [proteinHighFat, setProteinHighFat] = useState('');
  const [proteinUltraHighFat, setProteinUltraHighFat] = useState('');
  const [dairySkimmed, setDairySkimmed] = useState('');
  const [dairyLowFat, setDairyLowFat] = useState('');
  const [dairyFullFat, setDairyFullFat] = useState('');
  const [oilServings, setOilServings] = useState('');

  const handleSave = () => {
    const data: FoodCategoryData = {
      fruit: parseInt(fruitServings) || 0,
      vegetable: parseInt(vegetableServings) || 0,
      grain: parseInt(grainServings) || 0,
      protein: {
        lowFat: parseInt(proteinLowFat) || 0,
        mediumFat: parseInt(proteinMediumFat) || 0,
        highFat: parseInt(proteinHighFat) || 0,
        ultraHighFat: parseInt(proteinUltraHighFat) || 0,
      },
      dairy: {
        skimmed: parseInt(dairySkimmed) || 0,
        lowFat: parseInt(dairyLowFat) || 0,
        fullFat: parseInt(dairyFullFat) || 0,
      },
      oil: parseInt(oilServings) || 0,
    };
    onSave(data);
  };

  const CategoryIcon = ({ type }: { type: 'fruit' | 'vegetable' | 'grain' | 'meat' | 'milk' | 'oil' }) => {
    const iconSize = 56;

    switch (type) {
      case 'fruit':
        return <FruitIcon width={iconSize} height={iconSize} />;
      case 'vegetable':
        return <VegetablesIcon width={iconSize} height={iconSize} />;
      case 'grain':
        return <GrainsIcon width={iconSize} height={iconSize} />;
      case 'meat':
        return <MeatIcon width={iconSize} height={iconSize} />;
      case 'milk':
        return <MilkIcon width={iconSize} height={iconSize} />;
      case 'oil':
        return <OilIcon width={iconSize} height={iconSize} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={false}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <LinearGradient
          colors={['#FFFFFF', '#E6EEEE']}
          locations={[0, 0.86]}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: Colors.diaryHeaderButtonBackground, borderRadius: 100, width: 40 }]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <FontelloIcon name="ic_keyboard_arrow_left_24px" size={28} color={Colors.diaryHeaderButtonIcon} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>六大類編輯</Text>

          <TouchableOpacity
            style={{ marginRight: 8 }}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={styles.saveText}>儲存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Photo Section */}
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
            </View>
          ) :
            <View style={styles.photoContainer}>
              <View style={styles.photo}>
                <Text>123</Text>
              </View>
            </View>
          }

          {/* Meal Label */}
          <View style={styles.mealLabelContainer}>
            <TextInput
              style={styles.mealLabel}
              multiline
            >{mealLabel}123</TextInput>
          </View>

          {/* Food Categories Grid */}
          <View>
            {/* Row 1: Fruit, Vegetable, Grain */}
            <View style={styles.categoryRow}>
              <View style={styles.categoryItem}>
                <CategoryIcon type="fruit" />
                <Text style={styles.categoryLabel}>水果</Text>
                <TextInput
                  style={styles.servingInput}
                  placeholder="份數"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={fruitServings}
                  onChangeText={setFruitServings}
                />
              </View>

              <View style={styles.categoryItem}>
                <CategoryIcon type="vegetable" />
                <Text style={styles.categoryLabel}>蔬菜</Text>
                <TextInput
                  style={styles.servingInput}
                  placeholder="份數"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={vegetableServings}
                  onChangeText={setVegetableServings}
                />
              </View>

              <View style={styles.categoryItem}>
                <CategoryIcon type="grain" />
                <Text style={styles.categoryLabel}>全穀雜糧</Text>
                <TextInput
                  style={styles.servingInput}
                  placeholder="份數"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={grainServings}
                  onChangeText={setGrainServings}
                />
              </View>
            </View>

            {/* Row 2: Protein, Dairy, Oil */}
            <View style={styles.categoryRow}>
              {/* Protein Section with sub-options */}
              <View style={styles.categoryItem}>
                <CategoryIcon type="meat" />
                <Text style={styles.categoryLabel}>豆魚蛋肉</Text>
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="低脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={proteinLowFat}
                  onChangeText={setProteinLowFat}
                />
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="中脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={proteinMediumFat}
                  onChangeText={setProteinMediumFat}
                />
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="高脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={proteinHighFat}
                  onChangeText={setProteinHighFat}
                />
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="超高脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={proteinUltraHighFat}
                  onChangeText={setProteinUltraHighFat}
                />
              </View>

              {/* Dairy Section with sub-options */}
              <View style={styles.categoryItem}>
                <CategoryIcon type="milk" />
                <Text style={styles.categoryLabel}>乳品</Text>
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="脫脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={dairySkimmed}
                  onChangeText={setDairySkimmed}
                />
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="低脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={dairyLowFat}
                  onChangeText={setDairyLowFat}
                />
                <TextInput
                  style={styles.servingInputSmall}
                  placeholder="全脂"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={dairyFullFat}
                  onChangeText={setDairyFullFat}
                />
              </View>

              {/* Oil Section */}
              <View style={styles.categoryItem}>
                <CategoryIcon type="oil" />
                <Text style={styles.categoryLabel}>油脂</Text>
                <TextInput
                  style={styles.servingInput}
                  placeholder="份數"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  value={oilServings}
                  onChangeText={setOilServings}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  saveText: {
    fontSize: 17,
    fontWeight: '400',
    color: 'black',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  photoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    overflow: 'hidden',
    flex: 1,
    alignItems: 'center',
  },
  photo: {
    width: 300,
    height: 374,
    borderRadius: 12,
    backgroundColor: 'red'
  },
  mealLabelContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    paddingTop: 16,
    backgroundColor: 'white',
    borderBottomColor: '#ebebeb',
    borderBottomWidth: 0.5,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    maxHeight: 60,
    minHeight: 60,
  },
  categoryRow: {
    flexDirection: 'row',
  },
  categoryItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  servingInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
  servingInputSmall: {
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
  },
});
