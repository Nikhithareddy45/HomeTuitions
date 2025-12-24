import { Checkbox } from '@/components/ui/Checkbox';
import { TutorAction, TutorSelection, TutorStatus } from '@/types/enquiry';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TutorRow = ({
  tutor,
  onChange,
}: {
  tutor: TutorSelection;
  onChange: (updates: Partial<TutorSelection>) => void;
}) => {
  const [showActionPicker, setShowActionPicker] = React.useState(false);
  const [showStatusPicker, setShowStatusPicker] = React.useState(false);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'application_received': 'Application Received',
      'tutor_sent': 'Tutor Sent',
      'demo_requested': 'Demo Requested',
      'demo_completed': 'Demo Completed',
      'tutor_finalized': 'Tutor Finalized',
    };
    return statusMap[status] || status;
  };

  return (
    <View className="bg-white rounded-xl border border-gray-200 gap-2 overflow-visible mb-4 mx-4 p-4">
      <View className="flex-col space-y-4">
        {/* First Row: Checkbox and Tutor Name */}
        <View className="flex-row items-center">
          <Checkbox
            checked={tutor.checked}
            onChange={(val) => onChange({ checked: val })}
          />
          <Text className="ml-3 text-base font-medium text-gray-900 flex-1">
            {tutor.tutorName}
          </Text>
        </View>

        {/* Second Row: Dropdowns */}
        <View className="flex-row space-x-2 gap-2">
          {/* Action Dropdown */}
          <View className="flex-1">
            {/* <Text className="text-sm text-gray-500 mb-1">Action</Text> */}
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={tutor.action}
                onValueChange={(val: TutorAction) => {
                  onChange({ action: val });
                }}
                dropdownIconColor="rgba(107, 114, 128, 1)"
                
              >
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Accepted" value="accepted" />
                <Picker.Item label="Rejected" value="rejected" />
              </Picker>
            </View>
          </View>

          {/* Status Dropdown */}
          <View className="flex-1">
            {/* <Text className="text-sm text-gray-500 mb-1">Status</Text> */}
            <View className="border border-gray-300 rounded-md">
              <Picker
                selectedValue={tutor.status}
                onValueChange={(val: TutorStatus) => {
                  onChange({ status: val });
                }}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Application Received" value="application_received" />
                <Picker.Item label="Tutor Sent" value="tutor_sent" />
                <Picker.Item label="Demo Requested" value="demo_requested" />
                <Picker.Item label="Demo Completed" value="demo_completed" />
                <Picker.Item label="Tutor Finalized" value="tutor_finalized" />
              </Picker>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default TutorRow;
