
import EnquiryRequestCard from '@/components/EnquiryCard';
import { BackButton } from '@/components/ui/BackButton';
import { getMyEnquiriesAPI } from '@/services/enquiry';
import { useRefreshStore } from '@/store/useRefreshStore';
import { EnquiryAPI } from '@/types/enquiry';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EnquiryTabScreen = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<EnquiryAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { refreshToken } = useRefreshStore();

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyEnquiriesAPI();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch enquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [refreshToken]);

  const onRefresh = () => {
    setRefreshing(true);
    loadEnquiries().finally(() => setRefreshing(false));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 ">
      {/* Header */}
      <View className="flex-row items-center justify-around px-4 mt-1 mb-3">
        <BackButton />
        <Text className="text-2xl font-semibold ml-2">
          Your Enquiries
        </Text>
        <View className='bg-accent rounded-full p-2 '>
          <Pressable onPress={() => { router.push('/sections/OfflineStatus/BookOffline') }}>
            <Plus color="#115bca" size={24} />
          </Pressable>
        </View>
      </View>

      <View>

      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-2 text-sm text-gray-600">
            Loading enquiries...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 font-semibold mb-2">
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadEnquiries}
            className="px-4 py-2 rounded-xl bg-blue-600"
          >
            <Text className="text-white text-xs font-semibold">
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : enquiries.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="font-semibold text-gray-800">
            No offline enquiries yet
          </Text>
          <Text className="text-xs text-gray-500 text-center mt-1">
            Tap + to create a new offline enquiry.
          </Text>
        </View>
      ) : (
        <View className='px-3'>
          <FlatList
            data={enquiries}
            keyExtractor={item => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2563eb']}
                tintColor='#2563eb'
              />
            }
            renderItem={({ item }) => (
              <EnquiryRequestCard
                data={item}
                onPress={() =>
                  router.push(`/sections/OfflineStatus/${item.id}`)
                }
              />
            )}
            contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          />
        </View>
      )}

    </SafeAreaView>
  );
};

export default EnquiryTabScreen;
