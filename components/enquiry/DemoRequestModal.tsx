import DOBPicker from "@/components/ui/DOBInput";
import TimePicker from "@/components/ui/TimePicker";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

interface Props {
  open: boolean;
  onClose: () => void;
  tutorId: number | null;
  onSubmit: (data: {
    tutorId: number;
    demo_date: string;
    demo_time: string;
    message: string;
  }) => void;
}

export default function DemoRequestModal({
  open,
  onClose,
  tutorId,
  onSubmit,
}: Props) {
  const [demoDate, setDemoDate] = useState("");
  const [demoTime, setDemoTime] = useState("");
  const [message, setMessage] = useState("");

  if (!open || tutorId === null) return null;

  const handleSubmit = () => {
    if (!demoDate || !demoTime) {
      alert("Please select both date and time");
      return;
    }

    onSubmit({
      tutorId,
      demo_date: demoDate,
      demo_time: demoTime,
      message,
    });

    setDemoDate("");
    setDemoTime("");
    setMessage("");
    onClose();
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 h-full w-full bg-black/40 items-center justify-center"
      >
        <View className="w-[90%] bg-white-900 rounded-2xl p-6 border-2">
          <Text className="text-lg font-bold mb-4">
            Send Demo Request
          </Text>

          <DOBPicker
            label="Demo Date"
            value={demoDate}
            onChange={(d) => setDemoDate(d)}
            icon="Calendar"
          />

          <TimePicker
            label="Demo Time"
            value={demoTime}
            onChange={(t) => setDemoTime(t)}
          />

          {/* Message */}
          <Text className="font-semibold mb-1">Message (optional)</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            className="border border-gray-300 rounded-lg px-3 py-2 h-20 mb-4"
            textAlignVertical="top"
          />

          {/* Actions */}
          <View className="flex-row justify-end space-x-3">
            <Pressable
              onPress={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              <Text className="font-medium">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              className="px-4 py-2 bg-green-600 rounded-lg"
            >
              <Text className="text-white font-semibold">
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
