import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GenericMultiSelectProps } from '@/types/common';
import { useCloseDropdownOnInputFocus } from '../../utils/useCloseDropdownOnInputFocus';
import Icon from './IconComp';

interface UpdatedMultiSelectProps extends GenericMultiSelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GenericMultiSelect: React.FC<UpdatedMultiSelectProps> = ({
  iconName = 'AArrowDown',
  label = 'Select',
  placeholder = 'Select options',
  maxSelected,
  options,
  value,
  onChange,
  onOptionsChange,
  open,
  onOpenChange,
}) => {

  const [search, setSearch] = useState('');
  const [localOptions, setLocalOptions] = useState<string[]>(options);
  const containerRef = useRef<View | null>(null);

  // Close dropdown when other inputs are focused
  useCloseDropdownOnInputFocus(() => {
    if (open) onOpenChange(false);
  });

  // keep localOptions in sync
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return localOptions;
    return localOptions.filter(o => o.toLowerCase().includes(q));
  }, [localOptions, search]);

  const lowerAll = localOptions.map(o => o.toLowerCase());
  const canAddNew =
    search.trim().length > 0 && !lowerAll.includes(search.trim().toLowerCase());

  const toggleOpen = () => {
    onOpenChange(!open);
    if (!open) Keyboard.dismiss();
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter(v => v !== item));
    } else {
      if (maxSelected && value.length >= maxSelected) return;
      onChange([...value, item]);
    }
  };

  const handleAddNew = () => {
    const newItem = search.trim();
    if (!newItem) return;

    if (!localOptions.includes(newItem)) {
      const updated = [...localOptions, newItem];
      setLocalOptions(updated);
      onOptionsChange?.(updated);
    }
    if (!value.includes(newItem) && (!maxSelected || value.length < maxSelected)) {
      onChange([...value, newItem]);
    }
    setSearch('');
  };

  const handleBackdropPress = () => {
    onOpenChange(false);
  };

  return (
    <View ref={containerRef} className="w-full relative">
      <View className='flex-row items-center gap-3 mb-2'>
        {iconName && <Icon name={iconName} size={18} />}
        {label && <Text className="text-md font-bold text-primary">{label}</Text>}
      </View>

      {/* Display field */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleOpen}
        className="w-full px-3 py-3 rounded-2xl border border-gray-300 bg-white flex-row items-center justify-between"
      >
        <Text
          className={`text-md ${value.length ? 'text-slate-900' : 'text-gray-400'}`}
        >
          {value.length ? value.join(', ') : placeholder}
        </Text>
        <Icon
          name={open ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          color="#6b7280"
        />
      </TouchableOpacity>

      {open && (
        <>
          <Pressable
            onPress={handleBackdropPress}
            className="absolute inset-0 z-10"
          />

          <View className="absolute z-20 top-full left-0 right-0 mt-1 rounded-2xl border border-gray-200 bg-white shadow-lg max-h-72 overflow-hidden">

            {/* Search / add input */}
            <View className="border-b border-gray-200 p-2">
              <TextInput
                className="
                  w-full px-3 py-2 text-md rounded-xl border border-gray-300
                  bg-white text-slate-900
                "
                placeholder="Search or add..."
                placeholderTextColor="#9ca3af"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Options list */}
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
              <FlatList
                scrollEnabled={false}
                data={filteredOptions}
                keyExtractor={(item) => item}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingVertical: 4 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    className="flex-row items-center px-3 py-2 rounded-md active:bg-gray-100"
                  >
                    <View
                      className={`
                        w-5 h-5 rounded border mr-2 items-center justify-center
                        ${value.includes(item) ? 'bg-primary border-primary' : 'border-gray-400'}
                      `}
                    >
                      {value.includes(item) && (
                        <Icon name="Check" size={12} color="#ffffff" />
                      )}
                    </View>
                    <Text className="text-md text-slate-800">{item}</Text>
                  </Pressable>
                )}
                ListEmptyComponent={
                  !canAddNew ? (
                    <Text className="px-3 py-2 text-xs text-gray-500">
                      No matches found
                    </Text>
                  ) : null
                }
              />
            </ScrollView>

            {/* Add new */}
            {canAddNew && (
              <Pressable
                onPress={handleAddNew}
                className="px-3 py-2 bg-gray-50 active:bg-gray-100"
              >
                <Text className="text-sm text-primary">
                  Add &quot{search.trim()}&quot
                </Text>
              </Pressable>
            )}

            {/* Max info */}
            {maxSelected && value.length >= maxSelected && (
              <Text className="px-3 py-1 text-[11px] text-gray-500">
                You can select up to {maxSelected} items.
              </Text>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default GenericMultiSelect;
