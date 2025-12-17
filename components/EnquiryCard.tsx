// components/EnquiryCard.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowRight,
  Clock,
  User,
  Mail,
  Phone,
  IndianRupee,
} from 'lucide-react-native';
import { EnquiryAPI } from '@/types/enquiry';

type Props = {
  data: EnquiryAPI;
  onPress?: () => void;
};

const EnquiryRequestCard: React.FC<Props> = ({ data, onPress }) => {
  const getStatusStyle = () => {
    switch (data.status.toLowerCase()) {
      case 'accepted':
        return {
          container: 'bg-emerald-100',
          text: 'text-emerald-800',
        };
      case 'pending':
        return {
          container: 'bg-amber-100',
          text: 'text-amber-800',
        };
      default:
        return {
          container: 'bg-gray-100',
          text: 'text-gray-800',
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white-900 rounded-xl border border-gray-200 mb-4 overflow-hidden"
    >
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
        <Text className="text-sm font-semibold text-gray-800">
          Enquiry #{data.id}
        </Text>
        <View className={`px-2 py-1 rounded-full ${statusStyle.container}`}>
          <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
            {data.status}
          </Text>
        </View>
      </View>

      {/* Student */}
      <View className="px-4 py-3 space-y-2 gap-1">
        <View className="flex-row items-center">
          <User size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-700">
            {data.user_username}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Mail size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-600">
            {data.email}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Phone size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-600">
            {data.mobile_number}
          </Text>
        </View>
      </View>

      {/* Class & Board */}
      <View className="px-4 py-2 gap-2 ">
        {/* <Text className="text-sm font-medium text-gray-700">
          Class & Board
        </Text> */}
        <View className="flex-row flex-wrap">
          <View className="bg-blue-50 px-2 rounded mr-2">
            <Text className="text-xs text-blue-700">
              Class {data.student_class}
            </Text>
          </View>
          {data.board.map((b, i) => (
            <View
              key={i}
              className="bg-purple-50 px-2 rounded mr-2"
            >
              <Text className="text-xs text-purple-700">{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Subjects */}
        <View className="px-4 py-1 gap-2 ">
        {/* <Text className="text-sm font-medium text-gray-700">
          Subjects
        </Text> */}
        <View className="flex-row flex-wrap">
          {data.subjects.map((sub, i) => (
            <View
              key={i}
              className="bg-green-50 px-2 py-1 rounded mr-2"
            >
              <Text className="text-xs text-green-700">{sub}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Timing & Budget */}
      <View className="px-4 py-3 space-y-2">
        <View className="flex-row gap-2">
          <View className="flex-row items-center">
            <Clock size={14} color="#6b7280" />
            {/* <Text className="text-sm text-gray-600">Timing: </Text> */}
          </View>
          <Text className="text-sm font-medium">
            {data.teaching_starttime} – {data.teaching_endtime}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <View className="flex-row items-center">  
            <IndianRupee size={14} color="#6b7280" />
            {/* <Text className="ml-2 text-sm text-gray-600">Budget</Text> */}
          </View>
          <Text className="text-sm font-medium">
            ₹{data.minimum_price} – ₹{data.maximum_price}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-center py-3 bg-blue-50 border-t border-blue-100"
      >
        <Text className="text-sm font-medium text-blue-600 mr-1">
          View Status
        </Text>
        <ArrowRight size={14} color="#2563eb" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default EnquiryRequestCard;
