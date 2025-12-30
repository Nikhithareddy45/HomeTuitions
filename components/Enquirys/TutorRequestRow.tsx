// components/TutorRequestRow.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CheckCircle, XCircle, Clock } from "lucide-react-native";

type TutorRequest = {
  id: number;
  tutor: string;
  status: "pending" | "accepted" | "rejected" | string;
  demo_status?: string;
  created: string;
};

type Props = {
  data: TutorRequest;
  onPress?: () => void;
  selected?: boolean;
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <CheckCircle size={14} color="#15803d" />,
      };
    case "rejected":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle size={14} color="#b91c1c" />,
      };
    default:
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <Clock size={14} color="#a16207" />,
      };
  }
};

const TutorRequestRow: React.FC<Props> = ({ data, onPress }) => {
  const badge = getStatusBadge(data.status);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-3"
    >
      {/* Top Row */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold text-gray-800">
          ID #{data.id}
        </Text>

        <View className={`flex-row items-center px-2 py-1 rounded-full ${badge.bg}`}>
          {badge.icon}
          <Text className={`ml-1 text-xs font-semibold capitalize ${badge.text}`}>
            {data.status}
          </Text>
        </View>
      </View>

      {/* Tutor */}
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-500">Tutor</Text>
        <Text className="text-sm font-medium text-gray-800">
          {data.tutor}
        </Text>
      </View>

      {/* Demo Status */}
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-500">Demo Status</Text>
        <Text className="text-sm text-gray-700">
          {data.demo_status ?? "Not sent"}
        </Text>
      </View>

      {/* Created */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500">Created</Text>
        <Text className="text-xs text-gray-600">
          {data.created}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TutorRequestRow;
