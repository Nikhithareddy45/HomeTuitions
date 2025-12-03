import * as LucideIcons from 'lucide-react-native';
import React from 'react';

export type LucideIconName = keyof typeof LucideIcons;

interface IconProps {
  name: LucideIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 18, 
  color = '#000',
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
