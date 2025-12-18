import { LucideIconName } from '@/types/common';
import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Button from './Button';
import Icon from './IconComp';
interface TimePickerProps {
  label?: string;
  value?: string; // HH:MM format
  onChange: (time: string) => void;
  error?: string;
  iconName?: LucideIconName;
}

const TimePicker: React.FC<TimePickerProps> = ({
  label = 'Select Time',
  value = '',
  onChange,
  error,
  iconName = 'Clock',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [hours, setHours] = useState<string>(value ? value.split(':')[0] : '09');
  const [minutes, setMinutes] = useState<string>(value ? value.split(':')[1] : '00');

  const handleConfirm = () => {
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    onChange(formattedTime);
    setShowModal(false);
  };

  const incrementHours = () => {
    const h = parseInt(hours) + 1;
    setHours((h % 24).toString());
  };

  const decrementHours = () => {
    const h = parseInt(hours) - 1;
    setHours((h < 0 ? 23 : h).toString());
  };

  const incrementMinutes = () => {
    const m = (parseInt(minutes) + 15) % 60;
    setMinutes(m.toString());
  };

  const decrementMinutes = () => {
    const m = (parseInt(minutes) - 15 + 60) % 60;
    setMinutes(m.toString());
  };

  return (
    <View className="mb-4 gap-2 ">
      {/* Label with icon */}
      <View className="flex-row items-center mb-1">
        {iconName && (
          <View className="mr-3">
            <Icon name={iconName} size={18} color="#115bca" />
          </View>
        )}
        <Text className="text-md font-semibold text-primary">{label}</Text>
      </View>

      {/* Time display field */}
      <Pressable
        onPress={() => setShowModal(true)}
        className="rounded-lg px-4 py-3 border-2 border-gray-300 flex-row items-center justify-between mr-2"
      >
        <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value || 'HH:MM'}
        </Text>
        <Icon name="ChevronDown" size={18} color="#115bca" />
      </Pressable>

      {/* Error message */}
      {error && (
        <View className="flex-row items-center">
          <View className="mr-1">
            <Icon name="AlertCircle" size={12} color="#ef4444" />
          </View>
          <Text className="text-xs text-danger">{error}</Text>
        </View>
      )}

      {/* Time Picker Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <Pressable
          onPress={() => setShowModal(false)}
          className="flex-1 bg-black/50 items-center justify-center"
        >
          <View className="bg-white-900 rounded-2xl p-6 w-80">
            <Text className="text-lg font-bold text-center mb-6">Select Time</Text>

            {/* Time Input Section */}
            <View className="flex-row items-center justify-center gap-4 mb-6">
              {/* Hours */}
              <View className="items-center">
                <Pressable
                  onPress={incrementHours}
                  className="p-2 rounded-lg active:bg-gray-100"
                >
                  <Icon name="ChevronUp" size={24} color="#115bca" />
                </Pressable>
                <Text className="text-3xl font-bold w-16 text-center">
                  {hours.padStart(2, '0')}
                </Text>
                <Pressable
                  onPress={decrementHours}
                  className="p-2 rounded-lg active:bg-gray-100"
                >
                  <Icon name="ChevronDown" size={24} color="#115bca" />
                </Pressable>
              </View>

              <Text className="text-3xl font-bold">:</Text>

              {/* Minutes */}
              <View className="items-center">
                <Pressable
                  onPress={incrementMinutes}
                  className="p-2 rounded-lg active:bg-gray-100"
                >
                  <Icon name="ChevronUp" size={24} color="#115bca" />
                </Pressable>
                <Text className="text-3xl font-bold w-16 text-center">
                  {minutes.padStart(2, '0')}
                </Text>
                <Pressable
                  onPress={decrementMinutes}
                  className="p-2 rounded-lg active:bg-gray-100"
                >
                  <Icon name="ChevronDown" size={24} color="#115bca" />
                </Pressable>
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">

              <Button
                title="Cancel"
                onPress={() => setShowModal(false)}
                className="flex-1 py-3 rounded-lg items-center w-[45%]"
                icon="x"
                outline 
              />
              <Button
                onPress={handleConfirm}
                title="Confirm"
                className="flex-1 py-3 rounded-lg bg-primary items-center w-[45%]"
                icon="check" />

            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default TimePicker;
