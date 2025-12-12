import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import Icon from '@/components/ui/IconComp';
import { LucideIconName } from '@/types/common';
import { triggerDropdownClose } from '../../utils/useCloseDropdownOnInputFocus';

interface InputProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  placeholder?: string;
  error?: string;
  iconName?: LucideIconName;
  iconColor?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  iconName,
  iconColor = '#115bca',
  className = '',
  editable = true,
  onChangeText,
  secureTextEntry,          // from props
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View className={`mb-4 gap-2 ${className}`}>
      {/* Label + left icon */}
      <View className="flex-row items-center mb-1">
        {iconName && (
          <View className="mr-3">
            <Icon name={iconName} size={18} color={iconColor} />
          </View>
        )}
        <Text className="text-md font-semibold text-primary">
          {label}
        </Text>
      </View>

      {/* Input row with optional eye icon */}
      <View
        className={`flex-row items-center rounded-xl border-2 px-4 ${editable ? 'border-gray-100' : 'border-gray-200 bg-gray-50'
          }`}
      >
        <TextInput
          className={`flex-1 py-3 ${error ? 'border-danger' : ''}`}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onChangeText={onChangeText}
          onFocus={() => triggerDropdownClose()}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(prev => !prev)}
            hitSlop={8}
          >
            <Icon
              name={showPassword ? 'EyeOff' : 'Eye'}
              size={18}
              color="#6b7280"
            />
          </Pressable>
        )}
      </View>

      {/* Error */}
      {error && (
        <View className="flex-row items-center mt-1">
          <View className="mr-1">
            <Icon name="AlertCircle" size={12} color="#ef4444" />
          </View>
          <Text className="text-xs text-danger">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default Input;
