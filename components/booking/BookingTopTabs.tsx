import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface BookingTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['All', 'Accepted', 'Pending', 'Rejected'];

const BookingTopTabs: React.FC<BookingTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="bg-white pt-2 pb-2 mb-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabChange(tab)}
            className={`mr-3 px-4 py-2 rounded-full border ${
              activeTab === tab
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`${
                activeTab === tab ? 'text-white font-medium' : 'text-slate-600'
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default BookingTopTabs;
