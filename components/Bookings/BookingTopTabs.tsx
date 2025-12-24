import React from 'react';
import { View, Pressable, Text } from 'react-native';

const TABS = ['All', 'Accepted', 'Rejected', 'Pending'];

interface Props {
  activeTab: string;
  onChange: (tab: string) => void;
}

const BookingTabs: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <View className="flex-row justify-between mb-4 bg-gray-300 rounded-full p-1 gap-2">
      {TABS.map(tab => (
        <Pressable
          key={tab}
          onPress={() => onChange(tab)}
          className={`flex-1 py-2 rounded-full ${
            activeTab === tab ? 'bg-indigo-600' : ''
          }`}
        >
          <Text
            className={`text-center text-md font-medium ${
              activeTab === tab ? 'text-white-900' : 'text-gray-600'
            }`}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BookingTabs;
