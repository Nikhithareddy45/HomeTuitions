import React from 'react';
import { View, Text, Image } from 'react-native';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Hourglass,
  CheckCircle,
  XCircle,
  MapPin,
} from 'lucide-react-native';

export interface BookingCardProps {
  application: {
    username: string;
    email: string;
    mobileNumber: string;
    address?: string;
    message?: string;
    demo_date?: string;
    demo_time?: string;
    status: 'accepted' | 'rejected' | 'pending';
    image?: string;
  };
}

const BookingCard: React.FC<BookingCardProps> = ({ application }) => {
  const {
    username,
    email,
    mobileNumber,
    address,
    message,
    demo_date,
    demo_time,
    status,
    image,
  } = application;

  const profileImage =
    image ||
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg';

  return (
    <View className="bg-white-900 flex-1 rounded-xl mx-4 mb-4 shadow-sm border-2 border-accent overflow-hidden">
      {/* Header */}
      <View className="items-center py-6">
        <Image
          source={{ uri: profileImage }}
          className="w-16 h-16 rounded-full"
        />
        <Text className="text-gray-900 text-md font-bold">{username}</Text>
      </View>

      {/* Content */}
      <View className="px-6 gap-2">
        <Row icon={<Mail size={14}/>} text={email} />
        <Row icon={<Phone size={14} />} text={mobileNumber} />

        {address && (
          <Row icon={<MapPin size={14}/>} text={address} />
        )}

        {message && (
          <Row
            icon={<MessageSquare size={14}/>}
            text={message}
          />
        )}

        {demo_date && (
          <Row
            icon={<Calendar size={14}/>}
            text={demo_date}
          />
        )}

        {demo_time && (
          <Row icon={<Clock size={14} />} text={demo_time} />
        )}

        {/* Status */}
        <View className="my-3">
          {status === 'accepted' && (
            <StatusBadge
              icon={<CheckCircle size={16} color="#15803d" />}
              text="Accepted"
              bg="bg-green-100"
              textColor="text-green-800"
            />
          )}
          {status === 'rejected' && (
            <StatusBadge
              icon={<XCircle size={16} color="#b91c1c" />}
              text="Rejected"
              bg="bg-red-100"
              textColor="text-red-800"
            />
          )}
          {status === 'pending' && (
            <StatusBadge
              icon={<Hourglass size={16} color="#a16207" />}
              text="Waiting for tutor confirmation"
              bg="bg-yellow-100"
              textColor="text-yellow-800"
            />
          )}
        </View>
      </View>
    </View>
  );
};

const Row = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <View className="flex-row items-start gap-3">
    {icon}
    <Text className="text-xs text-gray-700 flex-1">{text}</Text>
  </View>
);

const StatusBadge = ({
  icon,
  text,
  bg,
  textColor,
}: {
  icon: React.ReactNode;
  text: string;
  bg: string;
  textColor: string;
}) => (
  <View className={`${bg} rounded-full py-2 px-4 flex-row justify-center gap-2`}>
    {icon}
    <Text className={`${textColor} text-sm font-medium`}>{text}</Text>
  </View>
);

export default BookingCard;
