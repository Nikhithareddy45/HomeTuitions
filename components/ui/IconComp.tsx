import React from 'react';
import { IconProps } from '@/types/common';
import * as LucideIcons from 'lucide-react-native';
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 18, 
  color = '#115bca',
  strokeWidth = 2
}) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<any>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react-native`);
    return null;
  }

  return (
    <IconComponent 
      size={size} 
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default Icon;
