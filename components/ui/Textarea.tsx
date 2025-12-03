import Icon from '@/components/ui/IconComp';
import { LucideIconName } from '@/types/common';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { triggerDropdownClose } from '../../utils/useCloseDropdownOnInputFocus';

interface TextareaProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  placeholder?: string;
  error?: string;
  iconName?: LucideIconName;
  iconColor?: string;
  className?: string;
  rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  error,
  iconName,
  iconColor = '#115bca',
  className = '',
  rows = 5,
  onChangeText,
  ...rest
}) => {
  return (
    <View className={`mb-4 gap-2 ${className}`}>
      {/* Label + Icon */}
      <View className="flex-row items-center mb-1">
        {iconName && (
          <View className="mr-3">
            <Icon
              name={iconName}
              size={18}
              color={iconColor}
            />
          </View>
        )}
        <Text className="text-md font-semibold text-primary">
          {label}
        </Text>
      </View>

      {/* Textarea field */}
      <TextInput
        multiline
        numberOfLines={5}
        className={`rounded-lg px-4 py-3 border-2 border-gray-100 text-base
          ${error ? 'border-danger' : ''}
        `}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        onChangeText={onChangeText}
        onFocus={() => triggerDropdownClose()}
        textAlignVertical="top"
        {...rest}
      />

      {/* Error message */}
      {error && (
        <View className="flex-row items-center">
          <View className="mr-1">
            <Icon
              name="AlertCircle"
              size={12}
              color="#ef4444"
            />
          </View>
          <Text className="text-xs text-danger">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Textarea;
