import React from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search tutors, subjects…',
  value,
  onChangeText,
  onClear,
}) => {
  const showClear = value.length > 0;

  return (
    <View className="flex-row items-center m-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm w-[85%] h-16">
      <Search size={18} color="#636363ff" />
      <TextInput
        className="flex-1 ml-2 text-[15px] text-gray-900 "
        placeholder={placeholder}
        placeholderTextColor="#686969ff"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {showClear && (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          className="ml-1 rounded-full p-1"
        >
          <X size={16} color="#6b7280" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchBar;
