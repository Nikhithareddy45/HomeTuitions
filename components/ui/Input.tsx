import Icon, { LucideIconName } from '@/components/ui/Icon';
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  placeholder?: string;
  error?: string;
  icon?: LucideIconName;
  iconColor?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  icon,
  iconColor = '#115bca',
  className = '',
  onChangeText,
  ...rest
}) => {
  return (
    <View className={`mb-4 w-[90%] mx-auto gap-2 ${className}`}>
      {/* Label + Icon */}
      <View className="flex-row items-center mb-1">
        {icon && (
          <View className="mr-3">
            <Icon
              name={icon}
              size={18}
              color={iconColor}
            />
          </View>
        )}
        <Text className="text-md font-semibold text-primary">
          {label}
        </Text>
      </View>

      {/* Input field */}
      <TextInput
        className={` rounded-lg px-4 py-3 border-2 border-gray-100
          ${error ? 'border-danger' : ''}
        `}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        onChangeText={onChangeText}
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

export default Input;
