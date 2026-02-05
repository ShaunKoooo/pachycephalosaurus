import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  SectionList,
} from 'react-native';
import {
  CountryCode,
  getHotCountries,
  searchCountries,
  groupByAlphabet,
} from '@/data/countryCodes';

interface CountryCodePickerProps {
  visible: boolean;
  selectedCode: string;
  onSelect: (country: CountryCode) => void;
  onClose: () => void;
}

interface Section {
  title: string;
  titleZh: string;
  data: CountryCode[];
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  visible,
  selectedCode,
  onSelect,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const isSearching = searchText.trim().length > 0;

  // 處理選擇
  const handleSelect = (country: CountryCode) => {
    onSelect(country);
    setSearchText('');
    onClose();
  };

  // 準備分組資料
  const sections = useMemo((): Section[] => {
    if (isSearching) {
      // 搜尋模式
      const results = searchCountries(searchText);
      return [
        {
          title: 'Matches',
          titleZh: '最佳匹配',
          data: results,
        },
      ];
    }

    // 正常模式: 熱門 + 字母分組
    const hotCountries = getHotCountries();
    const grouped = groupByAlphabet();
    const alphabetSections = Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        titleZh: letter,
        data: grouped[letter],
      }));

    return [
      { title: 'Popular', titleZh: '熱門', data: hotCountries },
      ...alphabetSections,
    ];
  }, [searchText, isSearching]);

  // 渲染國家項目
  const renderItem = ({ item }: { item: CountryCode }) => {
    if (!item) return null;

    return (
      <TouchableOpacity style={styles.itemWrapper} onPress={() => handleSelect(item)}>
        <View style={styles.itemView}>
          <Text style={styles.itemName}>{item.nameZh}</Text>
          <Text style={styles.itemName}>{item.code}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染分組標題
  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={styles.titleView}>
      <Text style={styles.titleText}>{section.titleZh || section.title}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.modalWrapper}>
          {/* 標題列 */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>選擇國碼</Text>
          </View>

          {/* 搜尋框 */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋"
              placeholderTextColor="rgba(0, 0, 0, 0.4)"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchText('')}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 國家列表 */}
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `${item?.iso}-${index}`}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'rgb(238,243,244)',
  },
  modalWrapper: {
    flex: 1,
    paddingBottom: 30,
  },
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 45,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e3e3e',
    paddingHorizontal: 10,
  },
  closeButton: {
    marginHorizontal: 5,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: '#3e3e3e',
    fontWeight: '300',
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 16,
    backgroundColor: 'rgb(220,220,220)',
    borderRadius: 30,
    paddingHorizontal: 16,
    color: '#000',
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '300',
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 10,
    height: 45,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e3e3e',
    paddingRight: 5,
  },
  itemWrapper: {
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  itemView: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#48484A',
  },
});
