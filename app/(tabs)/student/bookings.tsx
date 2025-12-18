import { useRefreshStore } from '@/store/useRefreshStore';
import { Frown } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';

const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const { refreshToken } = useRefreshStore();

  const loadBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when available
      // const data = await getBookingsAPI();
      // setBookings(data);
      
      // Simulate API call
      setTimeout(() => {
        setBookings([]); // Empty array since we don't have real data yet
      }, 500);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [refreshToken]);

  const onRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  if (loading && !refreshing) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className='mt-2 text-gray-600'>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className='flex-1 bg-white'
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2563eb']}
          tintColor='#2563eb'
        />
      }
    >
      {bookings.length === 0 ? (
        <View className='flex-1 items-center justify-center gap-3 p-4'>
          <Text className='text-2xl font-semibold text-center'>No Bookings Yet</Text>
          <Frown size={32} color='#6b7280' />
          <Text className='text-gray-500 text-center'>
            Your upcoming bookings will appear here
          </Text>
          <Text className='text-sm text-gray-400 text-center mt-4'>
            Pull down to refresh
          </Text>
        </View>
      ) : (
        <View className='p-4'>
          {/* Booking items will be rendered here when available */}
          {bookings.map((booking) => (
            <View key={booking.id} className='bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100'>
              {/* Booking card content will go here */}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Bookings;