import Icon from '@/components/ui/IconComp';
import { LucideIconName } from '@/types/common';
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface DOBPickerProps {
  value?: string;
  onChange: (date: string) => void;
  error?: string;
  label?: string;
  icon?: LucideIconName;
}

const DOBPicker: React.FC<DOBPickerProps> = ({
  value,
  onChange,
  error,
  label = "Date of Birth",
  icon = "Calendar"
}) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Sync date when value changes externally
  useEffect(() => {
    if (value) {
      try {
        setDate(new Date(value));
      } catch {
        setDate(undefined);
      }
    }
  }, [value]);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formatted = selectedDate.toISOString().split("T")[0];
      onChange(formatted);
    }
  };

  const formattedDisplay =
    date?.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) || "";

  return (
    <View className="mb-4 gap-2">
      {/* Label */}
      <View className="flex-row items-center mb-1">
        <View className="mr-3">
          <Icon name={icon} size={18} color="#115bca" strokeWidth={2} />
        </View>
        <Text className="text-md font-semibold text-primary">{label}</Text>
      </View>

      {/* Input box */}
      <Pressable onPress={() => setShow(true)}>
        <View className="rounded-xl h-14 px-4 border-2 border-gray-100 flex-row items-center justify-between bg-white">
          <Text
            className={`text-base ${
              formattedDisplay ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {formattedDisplay || "DD-MM-YYYY"}
          </Text>

          <Icon name="Calendar" size={20} color="#6b7280" />
        </View>
      </Pressable>

      {/* Error */}
      {error && (
        <View className="flex-row items-center mt-1">
          <Icon name="AlertCircle" size={12} color="#ef4444" />
          <Text className="ml-1 text-xs text-red-500">{error}</Text>
        </View>
      )}

      {/* DateTimePicker */}
      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "default" : "calendar"}
          onChange={handleChange}
          minimumDate={new Date(1800, 0, 1)}
        />
      )}
    </View>
  );
};

export default DOBPicker;
