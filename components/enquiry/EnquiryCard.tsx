import { EnquiryAPI } from "@/types/enquiry";
import { useRouter } from 'expo-router';
import {
  Clock,
  IndianRupee,
  Mail,
  Phone,
  User,
  TrendingUp,
  Info
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  enquiry: EnquiryAPI;
  onPress?: () => void;
};

const EnquiryCard: React.FC<Props> = ({ enquiry, onPress }) => {
  const router = useRouter();
  console.log(enquiry.id);

  const handleTrackStatus = () => {
    // Navigate to EnquiryStatusScreen and pass enquiryId as a param
    router.push({
      pathname: '/sections/enquiries/EnquiryStatusScreen',
      params: { enquiryId: enquiry.id },
    });
  };

  const handleViewInfo = () => {
    router.push({
      pathname: '/sections/enquiries/ViewInfo',
      params: { enquiryId: enquiry.id },
    });
  }
  const getStatusStyle = () => {
    switch (enquiry.status) {
      case "accepted":
        return {
          container: "bg-emerald-100",
          text: "text-emerald-800",
        };
      case "rejected":
        return {
          container: "bg-red-100",
          text: "text-red-800",
        };
      default:
        return {
          container: "bg-amber-100",
          text: "text-amber-800",
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <View
      className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden"
    >
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
        <Text className="text-sm font-semibold text-gray-800">
          Enquiry #{enquiry.id}
        </Text>

        <View className={`px-2 py-1 rounded-full ${statusStyle.container}`}>
          <Text
            className={`text-xs font-medium capitalize ${statusStyle.text}`}
          >
            {enquiry.status.replace("_", " ")}
          </Text>
        </View>
      </View>

      {/* Student Info */}
      <View className="px-4 py-1 gap-2">
        <View className="flex-row items-center">
          <User size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-700">
            {enquiry.user_username}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Mail size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-600">
            {enquiry.email}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Phone size={14} color="#6b7280" />
          <Text className="ml-2 text-sm text-gray-600">
            {enquiry.mobile_number}
          </Text>
        </View>
      </View>

      {/* Class & Board */}
      <View className="px-4 py-2 flex-row flex-wrap">
        {enquiry.student_class && (
          <View className="bg-blue-50 px-2 rounded mr-2 mb-2">
            <Text className="text-xs text-blue-700">
              Class {enquiry.student_class}
            </Text>
          </View>
        )}

        {enquiry.board && enquiry.board.map((b, i) => (
          <View
            key={i}
            className="bg-purple-50 px-2 rounded mr-2 mb-2"
          >
            <Text className="text-xs text-purple-700">{b}</Text>
          </View>
        ))}
      </View>

      {/* Subjects */}
      <View className="px-4 pt-1 flex-row flex-wrap">
        {enquiry.subjects && enquiry.subjects.map((sub, i) => (
          <View
            key={i}
            className="bg-green-50 px-2 rounded mr-2 mb-2"
          >
            <Text className="text-xs text-green-700">{sub}</Text>
          </View>
        ))}
      </View>

      {/* Timing & Budget */}
      <View className="px-4 py-3 gap-2">
        <View className="flex-row items-center gap-2">
          <Clock size={14} color="#6b7280" />
          <Text className="text-sm font-medium">
            {enquiry.teaching_starttime} – {enquiry.teaching_endtime}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <IndianRupee size={14} color="#6b7280" />
          <Text className="text-sm font-medium">
            ₹{enquiry.minimum_price} – ₹{enquiry.maximum_price}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center border-t border-gray-200 w-full">
        <TouchableOpacity
          onPress={handleTrackStatus}
          className="px-4 py-3 border-gray-300 border-r-2 w-[50%]"
        >
          <View className="flex-row items-center justify-center gap-2">
            <TrendingUp size={16} color="#2563eb" />
            <Text className="text-sm font-semibold text-blue-600">
              Track Status
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleViewInfo}
          className="px-4 py-3  w-[50%]"
        >
           <View className="flex-row items-center justify-center gap-2">
            <Info size={16} color="#2563eb" />
            <Text className="text-sm font-semibold text-blue-600">
              View Info
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EnquiryCard;
