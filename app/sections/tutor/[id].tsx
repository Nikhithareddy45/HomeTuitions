import { BackButton } from '@/components/ui/BackButton';
import { getTutorByIdAPI } from '@/services/tutor';
import { GetAllTutorData as TutorData } from '@/types/tutor';
import { useLocalSearchParams } from 'expo-router';
import {
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SeeTutorProfile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tutor, setTutor] = useState<TutorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displayTutorData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const tutorData = await getTutorByIdAPI(id);
      setTutor(tutorData);
      setError(null);
    } catch {
      setError('Failed to load tutor profile.');
      Alert.alert('Error', 'Failed to load tutor profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    displayTutorData();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!tutor || error) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50 px-6">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4"
      >
        <View className="flex-row items-center ml-3 mb-3 ">
          <BackButton />
          <Text className="text-2xl font-semibold ml-2">
            Tutor Profile
          </Text>
        </View>
        {/* Profile Header */}
        <View className="flex-1 p-3">
          <View className="bg-white rounded-2xl mb-5 items-center">
            <View className="w-20 h-20 rounded-full bg-indigo-100 mb-3 overflow-hidden items-center justify-center">
              {tutor.image ? (
                <Image
                  source={{ uri: tutor.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={36} color="#4f46e5" />
              )}
            </View>

            <Text className="text-xl font-semibold text-slate-900">
              {tutor.user.username}
            </Text>

            <Text className="text-md text-slate-500 mt-1">
              {tutor.experience} years experience
            </Text>

            {tutor.education_qualification && (
              <View className="flex-row items-center mt-2">
                <GraduationCap size={14} color="#4f46e5" />
                <Text className="test-md text-slate-700 ml-2">
                  {tutor.education_qualification}
                </Text>
              </View>
            )}

            {tutor.user.address && (
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color="#64748b" />
                <Text className="text-xs text-slate-500 ml-2">
                  {tutor.user.address.city}, {tutor.user.address.state}
                </Text>
              </View>
            )}
          </View>

          {/* Contact Info */}
          <View className="bg-white rounded-xl p-4 border-2 border-gray-300 mb-5">
            <Text className="text-base font-semibold text-slate-800 mb-3">
              Contact
            </Text>

            <View className="flex-row items-center mb-2">
              <Mail size={16} color="#6366f1" />
              <Text className="test-md text-slate-700 ml-3 flex-1">
                {tutor.user.email}
              </Text>
            </View>

            <View className="flex-row items-center mb-2">
              <Phone size={16} color="#10b981" />
              <Text className="test-md text-slate-700 ml-3">
                {tutor.user.mobile_number}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={16} color="#f59e0b" />
              <Text className="test-md text-slate-700 ml-3">
                ${tutor.price} / hour
              </Text>
            </View>
          </View>

          {/* About */}
          {tutor.about && (
            <View className="bg-white rounded-xl p-4 border-2 border-gray-300 mb-5">
              <Text className="text-base font-semibold text-slate-800 mb-2">
                About
              </Text>
              <Text className="test-md text-slate-600 leading-6">
                {tutor.about}
              </Text>
            </View>
          )}

          {/* Subjects */}
          {tutor.subjects?.length > 0 && (
            <View className="bg-white rounded-xl p-4 border-2 border-gray-300 mb-5">
              <Text className="text-base font-semibold text-slate-800 mb-3">
                Subjects
              </Text>
              <View className="flex-row flex-wrap">
                {tutor.subjects.map((subject, index) => (
                  <View
                    key={index}
                    className="bg-indigo-50 px-3 py-1.5 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-xs font-medium text-indigo-700">
                      {subject}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Additional Details */}
          <View className="bg-white rounded-xl p-4 border-2 border-gray-300 mb-5">
            <Text className="text-base font-semibold text-slate-800 mb-3">
              Additional Details
            </Text>

            {tutor.board?.length > 0 && (
              <View className="mb-3">
                <Text className="test-md font-medium text-slate-600 mb-1">Boards</Text>
                <View className="flex-row flex-wrap">
                  {tutor.board.map((board, index) => (
                    <View
                      key={`board-${index}`}
                      className="bg-blue-50 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-xs font-medium text-blue-700">
                        {board}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {tutor.classes?.length > 0 && (
              <View className="mb-3">
                <Text className="test-md font-medium text-slate-600 mb-1">Classes</Text>
                <View className="flex-row flex-wrap">
                  {tutor.classes.map((cls, index) => (
                    <View
                      key={`class-${index}`}
                      className="bg-green-50 px-3 py-1 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-xs font-medium text-green-700">
                        {cls}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="flex-row flex-wrap">
              {tutor.language && (
                <View className="mr-4 mb-2">
                  <Text className="test-md font-medium text-slate-600">Language</Text>
                  <Text className="test-md text-slate-700">{tutor.language}</Text>
                </View>
              )}

              {tutor.gender && (
                <View className="mb-2">
                  <Text className="test-md font-medium text-slate-600">Gender</Text>
                  <Text className="test-md text-slate-700 capitalize">{tutor.gender.toLowerCase()}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Availability */}
          {tutor.availabilities?.length > 0 && (
            <View className="bg-white rounded-xl p-4 border-2 border-gray-300 mb-8">
              <Text className="text-base font-semibold text-slate-800 mb-3">
                Availability
              </Text>
              <View className="flex-row flex-wrap">
                {tutor.availabilities.map((slot, index) => (
                  <View
                    key={index}
                    className="bg-emerald-50 px-3 py-1.5 rounded-lg mr-2 mb-2"
                  >
                    <Text className="text-xs font-medium text-emerald-700">
                      {slot.section}: {slot.start_time} – {slot.end_time}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView >
  );
};

export default SeeTutorProfile;
