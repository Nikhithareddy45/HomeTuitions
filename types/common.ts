import * as LucideIcons from 'lucide-react-native';
export type LucideIconName = keyof typeof LucideIcons;

export interface IconProps {
  name: LucideIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export interface ButtonProps {
  title: string;
  outline?: boolean;
  onPress?: () => void;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}
export interface RadioOption {
  label: string;
  value: string;
}
 
export interface RadioGroupProps {
  iconName?:LucideIconName;
  label?: string;
  options: RadioOption[];
  value: string | null;               // currently selected value
  onChange: (val: string) => void;
  direction?: 'row' | 'column';       // layout of options
}

export interface GenericMultiSelectProps {
   iconName?:LucideIconName;
  label?: string;
  placeholder?: string;
  maxSelected?: number;
  options: string[];                 // all available options (from parent)
  value: string[];                   // selected values
  onChange: (values: string[]) => void;
  onOptionsChange?: (values: string[]) => void; // when user adds new option
}

export interface AvailabilityWindow {
  section: string;
  start_time: string;
  end_time: string;
}

export interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  pin_code?: string | null;
  country?: string | null;
}