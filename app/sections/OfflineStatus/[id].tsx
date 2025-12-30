import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertCircle, Inbox } from "lucide-react-native";

import { getMyEnquiriesAPI } from "@/services/enquiry";
import TutorRequestRow from "@/components/Enquirys/TutorRequestRow";
import { BackButton } from "@/components/ui/BackButton";

type TutorRequest = {
  id: number;
  tutor_username?: string;
  tutor?: string;
  status: string;
  user_demo_status?: string;
  created: string;
};

const UserEnquiryList = () => {
  const [requests, setRequests] = useState<TutorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getMyEnquiriesAPI();

        // ✅ Works for both [] and { data: [] }
        const enquiries = Array.isArray(res) ? res : res?.data ?? [];
        setRequests(enquiries);
      } catch (err: any) {
        setError(err.message || "Failed to fetch enquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-2 text-gray-600">Loading enquiries...</Text>
      </SafeAreaView>
    );
  }

  /* ---------- Error ---------- */
  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center px-6 bg-slate-50">
        <AlertCircle size={40} color="#dc2626" />
        <Text className="mt-2 text-red-600 text-center">{error}</Text>
      </SafeAreaView>
    );
  }

  /* ---------- Screen ---------- */
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
        <BackButton />
        <Text className="ml-3 text-xl font-semibold text-gray-900">
          Tutor Requests
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1, // ✅ FIXES empty-center issue
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center px-6">
            <Inbox size={48} color="#9ca3af" />
            <Text className="mt-2 text-gray-700 font-medium">
              No Requests Found
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-1">
              You have not received any tutor requests yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TutorRequestRow
            data={{
              id: item.id,
              tutor: item.tutor_username || item.tutor || "N/A",
              status: item.status,
              demo_status: item.user_demo_status || "not sent",
              created: item.created,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default UserEnquiryList;
