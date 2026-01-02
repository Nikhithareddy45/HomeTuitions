import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getEnquiryDemoRequestsAPI,
  getSentTutorsAPI,
  sendTutorDemoAPI,
} from "@/services/enquiry";

import DemoRequestModal from "@/components/enquiry/DemoRequestModal";
import { BackButton } from "@/components/ui/BackButton";
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  User,
} from "lucide-react-native";

/* ================= TYPES ================= */

interface TutorItem {
  id: number;
  username: string;
}

interface SentTutor {
  id: number;
  tutors: TutorItem[];
  round_number: number;
}

interface DemoRequest {
  id: number;
  tutor: {
    id: number;
  };
  demo_date: string;
  demo_time: string;
  message?: string;
}

/* ================= COMPONENT ================= */

export default function ViewStatusScreen() {
  const { enquiryId: enquiryIdParam } = useLocalSearchParams<{ enquiryId?: string }>();
  const router = useRouter();
  const enquiryId = Number(enquiryIdParam);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [sentData, setSentData] = useState<SentTutor[]>([]);
  const [flowData, setFlowData] = useState<any[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [activeTutor, setActiveTutor] = useState<number | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!enquiryId) return;
    loadPageData();
  }, [enquiryId]);

  const loadPageData = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);

    try {
      const [tutorRes, demoRes] = await Promise.all([
        getSentTutorsAPI(enquiryId),
        getEnquiryDemoRequestsAPI(enquiryId),
      ]);

      setSentData(tutorRes || []);
      setDemoRequests(demoRes || []);
    } catch (err) {
      console.error("Failed loading status page", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ================= HELPERS ================= */

  const getDemoForTutor = (tutorId: number) =>
    demoRequests.find((d) => d.tutor.id === tutorId);

  const isDemoCompleted = (demo?: DemoRequest) => {
    if (!demo) return false;
    const demoDateTime = new Date(`${demo.demo_date}T${demo.demo_time}`);
    return new Date() >= demoDateTime;
  };

  /* ================= ACTIONS ================= */

  const handleSendDemo = async (values: any) => {
    if (!activeTutor) return;

    setActionLoading(activeTutor);
    try {
      await sendTutorDemoAPI(
        enquiryId,
        activeTutor,
        values.demo_date,
        values.demo_time,
        values.message || ""
      );

      alert("Demo scheduled successfully");
      setOpenModal(false);
      setActiveTutor(null);
      await loadPageData(true);
    } catch (err: any) {
      alert(err.response?.data?.error || "Demo scheduling failed");
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-4">
        <BackButton/>
        <Text className="text-2xl font-bold">Application Status</Text>

        <TouchableOpacity
          onPress={() => loadPageData(true)}
          className="flex-row items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg"
        >
          <RefreshCw size={16} color="white" />
          <Text className="text-white font-semibold">
            {refreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ROUNDS */}
      {sentData.map((round) => (
        <View key={round.id} className="bg-white rounded-xl mb-4 overflow-hidden">
          <View className="bg-blue-600 p-3">
            <Text className="text-white font-bold">
              Round {round.round_number}
            </Text>
          </View>

          {round.tutors.map((tutor) => {
            const demo = getDemoForTutor(tutor.id);

            return (
              <View
                key={tutor.id}
                className="border-b border-gray-200 p-4"
              >
                {/* Tutor */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/sections/tutor/[id]',
                      params: { id: String(tutor.id) }
                    })
                  }
                  className="flex-row items-center gap-3 mb-2"
                >
                  <User size={18} color="#2563eb" />
                  <Text className="text-blue-600 font-semibold">
                    {tutor.username}
                  </Text>
                  <ExternalLink size={14} color="#2563eb" />
                </TouchableOpacity>

                {/* Demo Status */}
                {!demo && (
                  <Text className="text-gray-500 mb-2">
                    No demo scheduled
                  </Text>
                )}

                {demo && (
                  <View className="bg-blue-50 p-3 rounded-lg mb-2">
                    <View className="flex-row items-center gap-2">
                      <CheckCircle size={16} color="#2563eb" />
                      <Text className="font-semibold text-blue-600">
                        Demo Scheduled
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-600 mt-1">
                      {demo.demo_date} • {demo.demo_time}
                    </Text>
                  </View>
                )}

                {/* Actions */}
                {!demo && (
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTutor(tutor.id);
                      setOpenModal(true);
                    }}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                    disabled={actionLoading === tutor.id}
                  >
                    <Text className="text-white text-center font-semibold">
                      {actionLoading === tutor.id
                        ? "Scheduling..."
                        : "Schedule Demo"}
                    </Text>
                  </TouchableOpacity>
                )}

                {demo && !isDemoCompleted(demo) && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <Calendar size={16} color="#f59e0b" />
                    <Text className="text-amber-600">
                      Upcoming Demo
                    </Text>
                  </View>
                )}

                {demo && isDemoCompleted(demo) && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <CheckCircle size={16} color="#16a34a" />
                    <Text className="text-green-600">
                      Demo Completed
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

      {/* MODAL */}
      <DemoRequestModal
        open={openModal}
        tutorId={activeTutor}
        onClose={() => {
          setOpenModal(false);
          setActiveTutor(null);
        }}
        onSubmit={handleSendDemo}
      />
    </ScrollView>
  );
}
