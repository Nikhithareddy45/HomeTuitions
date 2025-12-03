export interface ButtonProps {
  title: string;
  outline?: boolean;
  onPress?: () => void;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  children?: React.ReactNode;
}