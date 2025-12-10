import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import SearchBar from '@/components/ui/Search';
import TutorCard from '@/components/user/TutorCard';
import { GetAllTutorData } from '@/types/tutor';
import { getAllTutorsAPI } from '@/services/tutor';
import { FunnelPlus } from 'lucide-react-native';

const search = () => {
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('');
  const [tutors, setTutors] = useState<GetAllTutorData[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllTutorsAPI();
        setTutors(data);
      } catch (e) {
        console.log('Failed to load tutors', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTutors = tutors.filter(tutor => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const qNumber = Number(q)
  const userName = tutor.user.username.toLowerCase();
  const subjects = tutor.subjects.join(' ').toLowerCase();
  const classes = tutor.classes.join(' ').toLowerCase();
  const price = tutor.price

  return (
    userName.includes(q) ||
    subjects.includes(q) ||
    classes.includes(q)  || tutor.price != null && tutor.price <= qNumber
  );
});


  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4 gap-1">
      <View className='items-center flex-row justify-center '>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search tutors, subjects, classes..."
        />
         <FunnelPlus />
      </View>
      <FlatList
        data={filteredTutors}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <TutorCard tutor={item} />}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 80 }} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default search