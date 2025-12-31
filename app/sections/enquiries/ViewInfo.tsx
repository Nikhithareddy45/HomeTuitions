import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

/* =======================
   TYPES
======================= */

export type TutorActionStatus = "accepted" | "rejected" | "pending";

export interface TutorActionEntry {
  tutorId: number;
  tutorName: string;
  status: TutorActionStatus;   // backend status
  action: TutorActionStatus;   // user-selected action
  createdAt: string;
}

export interface EnquiryRound {
  round: number;
  createdAt: string;
  tutors: TutorActionEntry[];
}

/* =======================
   DUMMY DATA (5 Tutors)
======================= */

const DUMMY_TUTOR_ACTIONS: TutorActionEntry[] = [
  {
    tutorId: 1,
    tutorName: "Ramesh Kumar",
    status: "pending",
    action: "pending",
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    tutorId: 2,
    tutorName: "Suresh Rao",
    status: "accepted",
    action: "accepted",
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    tutorId: 3,
    tutorName: "Anjali Sharma",
    status: "rejected",
    action: "rejected",
    createdAt: "2025-01-02T11:30:00Z",
  },
  {
    tutorId: 4,
    tutorName: "Vikram Singh",
    status: "pending",
    action: "pending",
    createdAt: "2025-01-02T11:30:00Z",
  },
  {
    tutorId: 5,
    tutorName: "Neha Patel",
    status: "pending",
    action: "pending",
    createdAt: "2025-01-03T09:15:00Z",
  },
];

/* =======================
   ROUND BUILDER
======================= */

const buildRounds = (data: TutorActionEntry[]): EnquiryRound[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.createdAt]) acc[item.createdAt] = [];
    acc[item.createdAt].push(item);
    return acc;
  }, {} as Record<string, TutorActionEntry[]>);

  return Object.entries(grouped).map(([createdAt, tutors], index) => ({
    round: index + 1,
    createdAt,
    tutors,
  }));
};

/* =======================
   UI COMPONENT
======================= */

const EnquiryRoundsFlow = () => {
  const [rounds, setRounds] = useState(buildRounds(DUMMY_TUTOR_ACTIONS));

  const updateAction = (
    roundIndex: number,
    tutorId: number,
    action: TutorActionStatus
  ) => {
    const updated = [...rounds];
    const tutor = updated[roundIndex].tutors.find(
      (t) => t.tutorId === tutorId
    );
    if (tutor) tutor.action = action;
    setRounds(updated);
  };

  return (
    <View className="px-4 py-6 bg-white">
      {rounds.map((round, roundIndex) => (
        <View
          key={round.round}
          className="mb-6 border border-gray-200 rounded-xl p-4"
        >
          {/* Round Header */}
          <Text className="text-lg font-bold text-gray-800">
            Round {round.round}
          </Text>
          <Text className="text-xs text-gray-500 mb-4">
            {new Date(round.createdAt).toLocaleString()}
          </Text>

          {/* Tutors */}
          {round.tutors.map((tutor) => (
            <View
              key={tutor.tutorId}
              className="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <Text className="font-semibold text-gray-800">
                {tutor.tutorName}
              </Text>

              <Text className="text-xs text-gray-500 mt-1">
                Status: {tutor.status}
              </Text>

              {/* Action Selector */}
              <View className="flex-row mt-3 gap-2">
                {(["accepted", "rejected", "pending"] as TutorActionStatus[]).map(
                  (action) => (
                    <TouchableOpacity
                      key={action}
                      onPress={() =>
                        updateAction(roundIndex, tutor.tutorId, action)
                      }
                      className={`px-3 py-1 rounded-full ${
                        tutor.action === action
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          tutor.action === action
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {action}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default EnquiryRoundsFlow;
