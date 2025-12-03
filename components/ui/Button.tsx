import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface ButtonProps {
  title: string;
  onPress: () => void;
  outline?: boolean;
  className?: string;
  icon?: string;
  loading?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  outline = false,
  icon,
  loading = false,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <TouchableOpacity
      className={`
        flex-row items-center justify-center px-6 py-4 rounded-2xl shadow-lg
        ${!outline 
          ? 'bg-primary shadow-[0_4px_12px_rgba(79,70,229,0.3)]' 
          : 'bg-secondary border-2 border-primary'
        }
        ${disabled ? 'bg-gray-200 border-gray-400 shadow-none opacity-50' : ''}
        ${className}
      `}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <>
          {icon && (
            <Icon
              name={icon as any}
              size={20}
              color={outline ? '#4f46e5' : '#ffffff'}
              style={{ marginRight: 8 }}
            />
          )}
          <Text className={`
            text-base font-semibold text-center
            ${outline ? 'text-primary font-medium' : 'text-white font-bold'}
          `}>
            {title}
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
