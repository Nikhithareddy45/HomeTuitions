import Icon, { LucideIconName } from '@/components/ui/Icon';
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

const DOBPicker: React.FC<DOBPickerProps> = ({ value, onChange, error, label = "Date of Birth", icon = "Calendar" }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Sync internal state with value prop changes
  useEffect(() => {
    if (value && value !== "") {
      try {
        setDate(new Date(value));
      } catch (error) {
        console.warn("Invalid date format:", value);
        setDate(undefined);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShow(false); // close picker on Android
    if (selectedDate) {
      setDate(selectedDate);
      const formatted = selectedDate.toISOString().split("T")[0]; // yyyy-mm-dd
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
    <View className="mb-4 w-[90%] mx-auto gap-2">
      {/* Label with left icon */}
      <View className="flex-row items-center mb-1">
        <Icon
          name={icon}
          size={16}
          color="#115bca"
          strokeWidth={2}
        />
        <Text className="text-md font-semibold text-primary ml-2">
          {label}
        </Text>
      </View>

      {/* Input  */}
      <View className="relative">
        <Pressable onPress={() => setShow(true)} className="flex-1">
          <View
            className="rounded-lg px-4 py-3 border-2 border-gray-100 flex-row items-center justify-between"
          >
            <Text
              className={`text-base ${
                formattedDisplay ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {formattedDisplay || 'DD-MM-YYYY'}
            </Text>
          </View>
        </Pressable>

      </View>

      {/* Error message */}
      {error && (
        <View className="flex-row items-center mt-1">
          <View className="mr-1">
            <Icon
              name="AlertCircle"
              size={12}
              color="#ef4444"
            />
          </View>
          <Text className="text-xs text-red-500">{error}</Text>
        </View>
      )}

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "default" : "calendar"}
          onChange={handleChange}
          maximumDate={new Date()}
          minimumDate={new Date(1800, 0, 1)}
        />
      )}
    </View>
  );
};

export default DOBPicker;