import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getSentTutorsAPI,
  getEnquiryDemoRequestsAPI,
  sendTutorDemoAPI,
  userApplicationDecisionAPI,
} from "@/services/enquiry";

import DemoRequestModal from "@/components/enquiry/DemoRequestModal";
import { BackButton } from "@/components/ui/BackButton";
import { Calendar, CheckCircle, User } from "lucide-react-native";

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
  tutor: { id: number };
  demo_date: string;
  demo_time: string;
  user_application_accepted: "pending" | "accepted" | "rejected";
  tutor_application_accepted: "pending" | "accepted" | "rejected";
  is_application_finalized: boolean;
}

/* ================= COMPONENT ================= */

export default function ViewInfoScreen() {
  const { enquiryId: enquiryIdParam } =
    useLocalSearchParams<{ enquiryId?: string }>();
  const enquiryId = Number(enquiryIdParam);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sentData, setSentData] = useState<SentTutor[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTutor, setActiveTutor] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    if (enquiryId) loadData();
  }, [enquiryId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sent, demos] = await Promise.all([
        getSentTutorsAPI(enquiryId),
        getEnquiryDemoRequestsAPI(enquiryId),
      ]);
      setSentData(sent || []);
      setDemoRequests(demos || []);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */

  const getDemo = (tutorId: number) =>
    demoRequests.find(d => d.tutor.id === tutorId);

  const isDemoCompleted = (demo: DemoRequest) => {
    const dt = new Date(`${demo.demo_date}T${demo.demo_time}`);
    return new Date() >= dt;
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
      Alert.alert("Success", "Demo scheduled");
      setOpenModal(false);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecision = async (
    demoId: number,
    decision: "accepted" | "rejected"
  ) => {
    setActionLoading(demoId);
    try {
      await userApplicationDecisionAPI(demoId, decision);
      await loadData();
    } finally {
      setActionLoading(null);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <BackButton />
        <Text className="text-xl font-bold ml-3">View Info</Text>
      </View>

      {sentData.map(round => (
        <View key={round.id} className="bg-white rounded-xl mb-4 overflow-hidden">
          <View className="bg-blue-600 p-3">
            <Text className="text-white font-bold">
              Round {round.round_number}
            </Text>
          </View>

          {round.tutors.map(tutor => {
            const demo = getDemo(tutor.id);

            return (
              <View key={tutor.id} className="p-4 border-b border-gray-200">
                {/* Tutor */}
                <View className="flex-row items-center gap-2 mb-2">
                  <User size={16} color="#2563eb" />
                  <Text className="font-semibold text-blue-600">
                    {tutor.username}
                  </Text>
                </View>

                {/* NO DEMO */}
                {!demo && (
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTutor(tutor.id);
                      setOpenModal(true);
                    }}
                    className="bg-green-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold">
                      Schedule Demo
                    </Text>
                  </TouchableOpacity>
                )}

                {/* DEMO INFO */}
                {demo && (
                  <View className="bg-blue-50 p-3 rounded-lg">
                    <Text className="text-blue-700 font-semibold">
                      Demo Scheduled
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {demo.demo_date} • {demo.demo_time}
                    </Text>
                  </View>
                )}

                {/* UPCOMING */}
                {demo && !isDemoCompleted(demo) && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <Calendar size={14} color="#f59e0b" />
                    <Text className="text-amber-600">Upcoming Demo</Text>
                  </View>
                )}

                {/* APPLICATION ACTIONS */}
                {demo &&
                  isDemoCompleted(demo) &&
                  !demo.is_application_finalized &&
                  demo.user_application_accepted === "pending" && (
                    <View className="flex-row gap-3 mt-3">
                      <TouchableOpacity
                        onPress={() =>
                          handleDecision(demo.id, "accepted")
                        }
                        className="bg-green-600 px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-white text-center">
                          Accept
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          handleDecision(demo.id, "rejected")
                        }
                        className="bg-red-600 px-4 py-2 rounded-lg flex-1"
                      >
                        <Text className="text-white text-center">
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                {/* STATUS */}
                {demo?.user_application_accepted === "accepted" &&
                  demo?.tutor_application_accepted === "pending" && (
                    <Text className="mt-2 text-blue-600">
                      Waiting for tutor acceptance
                    </Text>
                  )}

                {demo?.is_application_finalized && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <CheckCircle size={16} color="#16a34a" />
                    <Text className="text-green-600 font-bold">
                      Application Finalized
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}

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
