import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      className={`w-5 h-5 rounded border-2 items-center justify-center
        ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}
        ${disabled ? 'opacity-50' : ''}`}
    >
      {checked && <Check size={14} color="white" />}
    </Pressable>
  );
};
