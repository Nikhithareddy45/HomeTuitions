import { BackButton } from '@/components/ui/BackButton';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import Button from '@/components/ui/Button';
import { useFilterStore } from "@/hooks/useFilterStore";
import { useRouter } from "expo-router";

const filtersData = {
  gender: ['Male', 'Female', 'Other'],
  language: ['Any Language', 'Telugu', 'English', 'Hindi'],
  rating: ['>=1 Star', '>=2 Stars', '>=3 Stars', '>=4 Stars', '5 Stars'],
  price: ['Any Price', '>=500', '>=1000'],
  board: ['CBSE', 'State Board', 'ICSE', 'IB', 'Other'],
  classes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG', 'PG'],
  education: ['B.Tech', 'B.Sc', 'B.Com', 'B.A', 'M.Tech', 'M.Sc', 'M.Com', 'M.A', 'PhD'],
  experience: ['Any', '>=1 Year', '>=2 Years', '>=3 Years', '>=5 Years'],
  availability: ['Morning', 'Afternoon', 'Evening'],
  location: ['Street 1', 'Street 2', 'Street 3', 'Street 4'],
};

const FilterScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<keyof typeof filtersData>('gender');
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState('');
  const router = useRouter();
  const setFilters = useFilterStore(state => state.setFilters);

  // Filtered options based on search
  const filteredOptions = useMemo(() => {
    const options = filtersData[selectedFilter];
    if (!search) return options;
    return options.filter(option =>
      option.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, selectedFilter]);

  const toggleValue = (value: string) => {
    const prev = selectedValues[selectedFilter] || [];
    if (prev.includes(value)) {
      setSelectedValues({
        ...selectedValues,
        [selectedFilter]: prev.filter(v => v !== value),
      });
    } else {
      setSelectedValues({
        ...selectedValues,
        [selectedFilter]: [...prev, value],
      });
    }
  };

  const selectedCount = selectedValues[selectedFilter]?.length || 0;
  const globalFilters = useFilterStore(state => state.selectedFilters);

  useEffect(() => {
    setSelectedValues(globalFilters);
  }, []);

  return (
    <View className="flex-1 flex-col">
      {/* Header */}
      <View className="flex-row items-center ml-3 pt-7 pb-3">
        <BackButton />
        <Text className="text-2xl font-semibold ml-2">
          Filters
        </Text>
      </View>


      <View className="flex-row flex-1 ml-1">
        {/* Left - Filter Names */}
        <ScrollView className="w-1/4 py-14">
          {Object.keys(filtersData).map(key => (
            <Pressable
              key={key}
              onPress={() => {
                setSelectedFilter(key as keyof typeof filtersData);
                setSearch(''); // reset search on filter change
              }}
              className={`px-4 py-3  ${selectedFilter === key ? 'bg-accent' : ''
                }`}
            // border-b border-gray-300
            >
              <Text className="text-base">
                {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                {selectedValues[key]?.length ? `(${selectedValues[key].length})` : ''}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Right - Filter Values */}
        <View className="w-3/4 p-4">
          {/* Search Box */}
          <TextInput
            placeholder={`Search ${selectedFilter}...`}
            value={search}
            onChangeText={setSearch}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
          />

          {/* Options with Checkboxes */}
          <FlatList
            data={filteredOptions}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const checked = selectedValues[selectedFilter]?.includes(item) || false;
              return (
                <Pressable
                  onPress={() => toggleValue(item)}
                  className="flex-row items-center py-2"
                >
                  <View
                    className={`w-5 h-5 mr-2 border rounded-sm border-gray-500 justify-center items-center ${checked ? 'bg-blue-600' : 'bg-white'
                      }`}
                  >
                    {checked && <Text className="text-white text-sm">✓</Text>}
                  </View>
                  <Text className="text-base">{item}</Text>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
      <View className="flex-row items-center justify-center mx-auto gap-3 mb-8">
        <Button
          title="Apply"
          onPress={() => {
            setFilters(selectedValues);
            router.back();
          }}
          className="w-[40%]"
          icon="check"
        />
        <Button
          title="Clear"
          onPress={() => {
            setSelectedValues({});
            setFilters({});
          }}
          outline={true}
          className="w-[40%]"
          icon="trash"
        />
      </View>
    </View>

  );
};

export default FilterScreen;
