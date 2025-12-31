import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllEnquiriesAPI } from "@/services/enquiry";
import { BackButton } from "@/components/ui/BackButton";
import EnquiryRow from "@/app/sections/enquiries/ViewInfo";

/* ================= TYPES ================= */

type Enquiry = {
  id: number;
  created: string;
  status: "pending" | "accepted" | "declrined";
  subjects?: string[];
};

/* ================= HELPERS ================= */

const groupIntoRounds = (data: Enquiry[]) => {
  const map: Record<string, Enquiry[]> = {};

  data.forEach((item) => {
    const key = new Date(item.created).toDateString();
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });

  return Object.entries(map).map(([date, items], index) => ({
    round: index + 1,
    date,
    items,
  }));
};

/* ================= ROUND CARD ================= */

const RoundCard = ({ round }: any) => {
  const [roundAction, setRoundAction] = useState("pending");
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-semibold text-gray-800">
          Round {round.round} • {round.date}
        </Text>

        {/* Round Action */}
        <TouchableOpacity
          onPress={() =>
            setRoundAction((prev) =>
              prev === "pending"
                ? "accepted"
                : prev === "accepted"
                ? "declined"
                : "pending"
            )
          }
          className="px-3 py-1 rounded-full bg-slate-100"
        >
          <Text className="text-xs capitalize">{roundAction}</Text>
        </TouchableOpacity>
      </View>

      {/* Rows */}
      {round.items.map((item: Enquiry) => (
        <EnquiryRow
          key={item.id}
          enquiry={item}
          selected={selected.includes(item.id)}
          onToggle={() => toggleSelect(item.id)}
          roundAction={roundAction}
        />
      ))}
    </View>
  );
};

/* ================= SCREEN ================= */

const UserEnquiryList = () => {
  const [data, setData] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllEnquiriesAPI();
        console.log("Enquiries response:", JSON.stringify(response, null, 2));
        setData(response);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rounds = useMemo(() => groupIntoRounds(data), [data]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center px-4 py-3 bg-white border-b">
        <BackButton />
        <Text className="ml-3 text-xl font-semibold">Enquiry Tracker</Text>
      </View>

      <FlatList
        data={rounds}
        keyExtractor={(item) => String(item.round)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <RoundCard round={item} />}
      />
    </SafeAreaView>
  );
};

export default UserEnquiryList;
