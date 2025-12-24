import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';

import BookingCard from '@/components/Bookings/BookingCard';
import BookingTabs from '@/components/Bookings/BookingTopTabs';
import {
  GetMyApplicationsAPI,
  getAcceptedAPI,
  getRejectedAPI,
  getPendingAPI,
} from '@/services/booking';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async (tab: string) => {
    try {
      setLoading(true);
      let data = [];

      switch (tab) {
        case 'Accepted':
          data = await getAcceptedAPI();
          break;
        case 'Rejected':
          data = await getRejectedAPI();
          break;
        case 'Pending':
          data = await getPendingAPI();
          break;
        default:
          data = await GetMyApplicationsAPI();
      }

      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
  }, [activeTab]);

  const renderBooking = ({ item }: { item: any }) => (
    <BookingCard
      application={{
        username: item.tutor.user.username,
        email: item.tutor.user.email,
        mobileNumber: item.tutor.user.mobile_number,
        address: item.tutor.user.address
          ? Object.values(item.tutor.user.address)
              .filter(Boolean)
              .join(', ')
          : '',
        message: item.message,
        demo_date: item.demo_date,
        demo_time: item.demo_time,
        status: item.status,
        image: item.tutor.image,
      }}
    />
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-2 text-gray-500">Loading bookings...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderBooking}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchBookings(activeTab)}
        />
      }
      ListHeaderComponent={
        <View>
          <Text className="text-2xl font-bold text-center my-4">
            My Bookings
          </Text>
          <BookingTabs activeTab={activeTab} onChange={setActiveTab} />
        </View>
      }
      ListEmptyComponent={
        <View className="items-center mt-20">
          <Text className="text-gray-500">No bookings found</Text>
        </View>
      }
    />
  );
};

export default Bookings;
