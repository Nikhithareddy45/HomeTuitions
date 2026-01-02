import { useRouter } from 'expo-router';
import {
    Calendar,
    CheckCircle,
    Clock,
    Hourglass,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    XCircle,
} from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export interface BookingCardProps {
  application: {
    tutorId: number;
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

  const router = useRouter();

  return (

    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/sections/tutor/[id]',
          params: { id: application.tutorId }, // ✅ tutor id
        })
      }
    >
      <View className="bg-white-900 rounded-xl mx-2 mb-4 border-2 border-white-900 overflow-hidden p-4">
        <View className="flex-row">
          {/* Left side - Tutor Profile */}
          <View className="items-center w-1/4 pr-4 border-gray-100">
            <Image
              source={{ uri: profileImage }}
              className="w-20 h-20 rounded-full mb-2 border-1"
            />
          </View>

          {/* Right side - Details */}
          <View className="flex-1 pl-4 gap-1">
            <Text className="text-gray-900 text-lg my-1 font-bold">{username}</Text>
            <Row icon={<Mail size={14} />} text={email} />
            <Row icon={<Phone size={14} />} text={mobileNumber} />
            {address && <Row icon={<MapPin size={14} />} text={address} isAddress={true} />}
            {message && <Row icon={<MessageSquare size={14} />} text={message} />}
            {demo_date && <Row icon={<Calendar size={14} />} text={demo_date} />}
            {demo_time && <Row icon={<Clock size={14} />} text={demo_time} />}
          </View>
        </View>

        {/* Status Bar - Full width below */}
        <View className="mt-4 pt-3 border-t border-gray-100">
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
    </TouchableOpacity>
  );
};

// Function to remove coordinates from address
const removeCoordinates = (text: string) => {
  return text.replace(/\(?[-+]?[0-9]*\.?[0-9]+\s*,\s*[-+]?[0-9]*\.?[0-9]+\)?/g, '').trim();
};

const Row = ({ icon, text, isAddress = false }: { icon: React.ReactNode; text: string; isAddress?: boolean }) => {
  const displayText = isAddress ? removeCoordinates(text) : text;
  return (
    <View className="flex-row items-start gap-3">
      {icon}
      <Text
        className={`text-sm text-gray-700 flex-1 ${isAddress ? 'line-clamp-2' : ''}`}
        numberOfLines={isAddress ? 2 : undefined}
        ellipsizeMode={isAddress ? 'tail' : undefined}
      >
        {displayText}
      </Text>
    </View>
  );
};

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
    <Text className={`${textColor} text-md font-medium`}>{text}</Text>
  </View>
);

export default BookingCard;
