import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/Search';
import TutorCard from '@/components/user/TutorCard';
import { getAllTutorsAPI } from '@/services/tutor';
import { useFilterStore } from '@/store/useFilterStore';
import { useRefreshStore } from '@/store/useRefreshStore';
import { GetAllTutorData } from '@/types/tutor';
import { useRouter } from 'expo-router';
import { FunnelPlus } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

// Filter function (NO location)
const applyFilters = (tutors: GetAllTutorData[], filters: Record<string, string[]>, query: string) => {
  const q = query.trim().toLowerCase();
  const qNum = Number(q);

  let result = tutors;

  // 1️⃣ Search text filter
  result = result.filter((tutor: GetAllTutorData) => {
    if (!q) return true;

    const username = tutor.user.username?.toLowerCase() || "";
    const subjects = tutor.subjects?.join(" ").toLowerCase() || "";
    const classes = tutor.classes?.join(" ").toLowerCase() || "";

    return (
      username.includes(q) ||
      subjects.includes(q) ||
      classes.includes(q) ||
      (tutor.price != null && tutor.price <= qNum)
    );
  });

  // 2️⃣ Apply selected filters
  result = result.filter((tutor: GetAllTutorData) => {
    return Object.entries(filters).every(([key, selected]) => {
      if (!selected || selected.length === 0) return true;
      switch (key) {
        case "gender":
          return selected.some(s => s.toLowerCase() === (tutor.gender || "").toLowerCase());
        case "language":
          return selected.some(s => s.toLowerCase() === (tutor.language || "").toLowerCase());
        case "board":
          return tutor.board?.some(b =>
            selected.some(s => s.toLowerCase() === b.toLowerCase())
          );
        case "classes":
          return tutor.classes?.some(c =>
            selected.some(s => s.toLowerCase() === c.toLowerCase())
          );
        case "education":
          return selected.some(s =>
            s.toLowerCase() === (tutor.education_qualification || "").toLowerCase()
          );
        case "subjects":
          return tutor.subjects?.some(s =>
            selected.some(sel => s.toLowerCase().includes(sel.toLowerCase()))
          );
        case "price":
          return selected.some((v: string) => {
            if (v === "Any Price") return true;
            const val = Number(v.replace(/[^0-9]/g, ""));
            return tutor.price !== null && tutor.price >= val;
          });
        case "experience":
          return selected.some((v: string) => {
            if (v === "Any") return true;
            const val = Number(v.replace(/[^0-9]/g, ""));
            return tutor.experience !== null && tutor.experience >= val;
          });
        default:
          return true;
      }
    });
  });

  return result;
};

const Search = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [tutors, setTutors] = useState<GetAllTutorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const appliedFilters = useFilterStore((state) => state.selectedFilters);
  const { refreshToken } = useRefreshStore();

  const loadTutors = async () => {
    try {
      setLoading(true);
      const data = await getAllTutorsAPI();
      setTutors(data);
    } catch (e) {
      console.log('Failed to load tutors', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and refresh on token change
  useEffect(() => {
    loadTutors();
  }, [refreshToken]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTutors();
  };

  const tutorsToShow = useMemo(() => {
    // console.log('Applying filters:', {
    //   tutorCount: tutors.length,
    //   appliedFilters,
    //   query,
    //   filteredCount: applyFilters(tutors, appliedFilters, query).length
    // });
    return applyFilters(tutors, appliedFilters, query);
  }, [tutors, appliedFilters, query]);

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4 gap-1">
      <View className="items-center flex-row justify-center">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search tutors, subjects, classes..."
        />

        <Pressable
          onPress={() => router.push('/sections/SearchScreen')}
          className="ml-2"
        >
          <FunnelPlus />
        </Pressable>
      </View>

      <FlatList
        data={tutorsToShow}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor='#2563eb'
          />
        }
        renderItem={({ item }) => <TutorCard tutor={item} />}
        contentContainerStyle={{
          paddingBottom: 80,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center gap-2 mt-4 p-4">
            <Text className="text-gray-500 text-lg font-semibold text-center">
              {tutors.length === 0
                ? "No tutors available"
                : "No tutors match your filters"}
            </Text>
            <Text className="text-gray-400 text-center">
              {tutors.length === 0
                ? "Please check back later"
                : "Try adjusting your search or filters"}
            </Text>
            {tutors.length > 0 && (
              <Button
                title="Clear All Filters"
                onPress={() => {
                  useFilterStore.getState().clearFilters();
                  setQuery('');
                }}
                outline
                className="mt-4"
              />
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          Object.keys(appliedFilters).length > 0 ? (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {Object.entries(appliedFilters).map(([key, values]) =>
                values?.map(value => (
                  <View
                    key={`${key}-${value}`}
                    className="bg-gray-200 rounded-full px-3 py-1 flex-row items-center"
                  >
                    <Text className="text-sm">
                      {key}: {value}
                    </Text>
                    <Pressable
                      onPress={() => {
                        const newFilters = { ...appliedFilters };
                        newFilters[key] = newFilters[key].filter(v => v !== value);
                        if (newFilters[key].length === 0) {
                          delete newFilters[key];
                        }
                        useFilterStore.getState().setFilters(newFilters);
                      }}
                      className="ml-2"
                    >
                      <Text>×</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
