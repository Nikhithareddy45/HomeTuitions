import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { EnquiryRound, TutorSelection } from '@/types/enquiry';
import TutorRow from '@/components/Enquirys/TutorRow';
import { BackButton } from '@/components/ui/BackButton';

const OfflineEnquiry = () => {
  const [rounds, setRounds] = useState<EnquiryRound[]>([
    {
      round: 1,
      tutors: Array.from({ length: 5 }).map((_, i) => ({
        tutorId: i + 1,
        tutorName: `Tutor ${i + 1}`,
        checked: false,
        action: 'pending',
        status: 'application_received',
      })),
    },
    {
      round: 2,
      tutors: [],
    },
    {
      round: 3,
      tutors: [],
    },
  ]);

  const updateTutor = (
    roundNumber: number,
    tutorId: number,
    updates: Partial<TutorSelection>
  ) => {
    setRounds(prev =>
      prev.map(round =>
        round.round === roundNumber
          ? {
              ...round,
              tutors: round.tutors.map(tutor =>
                tutor.tutorId === tutorId
                  ? { ...tutor, ...updates }
                  : tutor
              ),
            }
          : round
      )
    );
  };

  return (
    <FlatList
      data={rounds}
      style={{ margin: 16 }}
      keyExtractor={(item) => item.round.toString()}
      ListHeaderComponent={
      <View className="mb-6 gap-3 flex-row items-center">
        <BackButton/>
        <Text className="text-xl font-bold">Offline Enquiry</Text>
      </View>
        }
      renderItem={({ item: round }) => (
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">
            Round {round.round}
          </Text>

          {round.tutors.length === 0 ? (
            <Text className="text-gray-500 italic">
              No tutors assigned yet
            </Text>
          ) : (
            round.tutors.map(tutor => (
              <TutorRow
                key={tutor.tutorId}
                tutor={tutor}
                onChange={(updates) =>
                  updateTutor(round.round, tutor.tutorId, updates)
                }
              />
            ))
          )}
        </View>
      )}
    />
  );
};

export default OfflineEnquiry;
