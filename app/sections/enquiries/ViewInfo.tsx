import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";

/* =======================
   TYPES
======================= */

export type TutorActionStatus = "accepted" | "rejected" | "pending";

export interface TutorActionEntry {
  tutorId: number;
  tutorName: string;
  status: TutorActionStatus;
  action: TutorActionStatus;
  createdAt: string;
  selected?: boolean;
}

export interface EnquiryRound {
  round: number;
  createdAt: string;
  tutors: TutorActionEntry[];
}

/* =======================
   DUMMY DATA
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
    status: "pending",
    action: "pending",
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
   BUILD ROUNDS
======================= */

const buildRounds = (data: TutorActionEntry[]): EnquiryRound[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.createdAt]) acc[item.createdAt] = [];
    acc[item.createdAt].push({ ...item, selected: false });
    return acc;
  }, {} as Record<string, TutorActionEntry[]>);

  return Object.entries(grouped)
    .map(([createdAt, tutors], index) => ({
      round: index + 1,
      createdAt,
      tutors,
    }))
    .reverse(); // latest round on top
};

/* =======================
   COMPONENT
======================= */

const EnquiryRoundsFlow = () => {
  const [rounds, setRounds] = useState(buildRounds(DUMMY_TUTOR_ACTIONS));

  /* Toggle single tutor */
  const toggleTutorSelect = (roundIndex: number, tutorId: number) => {
    const updated = [...rounds];
    const tutor = updated[roundIndex].tutors.find(
      (t) => t.tutorId === tutorId
    );
    if (tutor && tutor.action !== "accepted") {
      tutor.selected = !tutor.selected;
    }
    setRounds(updated);
  };

  /* Toggle select all in round */
  const toggleSelectAll = (roundIndex: number) => {
    const updated = [...rounds];
    const tutors = updated[roundIndex].tutors;

    const allSelected = tutors.every(
      (t) => t.selected || t.action === "accepted"
    );

    tutors.forEach((t) => {
      if (t.action !== "accepted") {
        t.selected = !allSelected;
      }
    });

    setRounds(updated);
  };

  const updateAction = (
    roundIndex: number,
    tutorId: number,
    action: TutorActionStatus
  ) => {
    const updated = [...rounds];
    const tutor = updated[roundIndex].tutors.find(
      (t) => t.tutorId === tutorId
    );
    if (tutor) {
      tutor.action = action;
      if (action === "accepted") tutor.selected = false;
    }
    setRounds(updated);
  };

  return (
    <View className="px-4 py-6 bg-white">
      {rounds.map((round, roundIndex) => {
        const acceptedTutor = round.tutors.find(
          (t) => t.action === "accepted"
        );

        const allSelected = round.tutors.every(
          (t) => t.selected || t.action === "accepted"
        );

        return (
          <View key={round.round} className="mb-8">
            {/* Round Header */}
            <View className="flex-row justify-between items-center mb-3">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  Round {round.round}
                </Text>
                <Text className="text-xs text-gray-500">
                  {new Date(round.createdAt).toLocaleString()}
                </Text>
              </View>

              {/* Select All */}
              <Pressable
                onPress={() => toggleSelectAll(roundIndex)}
                className="flex-row items-center"
              >
                <View
                  className={`w-4 h-4 mr-2 rounded border ${
                    allSelected ? "bg-blue-600" : "bg-white"
                  }`}
                />
                <Text className="text-sm text-gray-600">Select all</Text>
              </Pressable>
            </View>

            {/* Tutors */}
            <View className="border border-gray-200 rounded-xl bg-gray-50">
              {round.tutors.map((tutor) => {
                const isAccepted = tutor.action === "accepted";

                return (
                  <View
                    key={tutor.tutorId}
                    className={`flex-row items-center justify-between px-3 py-3 border-b border-gray-200 ${
                      isAccepted ? "bg-green-50" : "bg-white"
                    }`}
                  >
                    {/* Checkbox */}
                    <Pressable
                      onPress={() =>
                        toggleTutorSelect(roundIndex, tutor.tutorId)
                      }
                      disabled={isAccepted}
                      className={`w-4 h-4 mr-3 rounded border ${
                        tutor.selected ? "bg-blue-600" : "bg-white"
                      }`}
                    />

                    {/* Tutor Info */}
                    <View className="flex-1 pr-2">
                      <Text className="font-medium text-gray-800">
                        {tutor.tutorName}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        Status: {tutor.status}
                      </Text>

                      {isAccepted && (
                        <Text className="text-xs text-green-600 font-semibold mt-1">
                          ✔ Accepted
                        </Text>
                      )}
                    </View>

                    {/* Action Picker */}
                    <View
                      className={`w-24 h-8 justify-center rounded-md ${
                        isAccepted
                          ? "bg-gray-200"
                          : "border border-gray-300 bg-white"
                      }`}
                    >
                      <Picker
                        enabled={!isAccepted}
                        selectedValue={tutor.action}
                        onValueChange={(value) =>
                          updateAction(
                            roundIndex,
                            tutor.tutorId,
                            value as TutorActionStatus
                          )
                        }
                        style={{ height: 30 }}
                      >
                        <Picker.Item label="Pending" value="pending" />
                        <Picker.Item label="Accept" value="accepted" />
                        <Picker.Item label="Reject" value="rejected" />
                      </Picker>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Next Round Triggered */}
            {acceptedTutor && roundIndex !== rounds.length - 1 && (
              <View className="items-center mt-3">
                <Text className="text-xs text-blue-600 font-semibold">
                  ⬇ Next Round Triggered
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default EnquiryRoundsFlow;
