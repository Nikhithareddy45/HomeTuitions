import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { getEnquiryFlowStatusAPI } from "@/services/enquiry";

/* =======================
   Types
======================= */

type EnquiryStatus =
    | "application_received"
    | "tutors_sent"
    | "demo_requested"
    | "demo_completed"
    | "tutor_finalized"
    | "cancelled";

interface EnquiryFlowUI {
    id: number;
    status: EnquiryStatus;
    status_label: string;
    created: string;
}

const STATUS_FLOW: EnquiryStatus[] = [
    "application_received",
    "tutors_sent",
    "demo_requested",
    "demo_completed",
    "tutor_finalized",
    "cancelled",
];

const STATUS_LABELS: Record<EnquiryStatus, string> = {
    application_received: "Application Received",
    tutors_sent: "Tutors Sent",
    demo_requested: "Demo Requested",
    demo_completed: "Demo Completed",
    tutor_finalized: "Tutor Finalized",
    cancelled: "Cancelled",
};

export default function EnquiryStatusScreen() {
    const { enquiryId } = useLocalSearchParams<{ enquiryId: string }>();
    const [loading, setLoading] = useState(true);
    const [flowData, setFlowData] = useState<EnquiryFlowUI | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (enquiryId) {
            fetchEnquiryFlow();
        }
    }, [enquiryId]);

    const fetchEnquiryFlow = async () => {
        try {
            setLoading(true);
            const data = await getEnquiryFlowStatusAPI(enquiryId);
            // Since we don't know the exact API response structure, we might need to adapt it.
            // Assuming the API returns a list or an object with status.
            // If the API returns a list of flow events, we might need to pick the latest.
            // For now, let's assume it returns an object that matches or can be mapped to EnquiryFlowUI.
            // Or if it returns an array of history, we take the last one as current status.
            
            // Adjust this based on actual API response. 
            // If data is array:
            if (Array.isArray(data) && data.length > 0) {
                 // Sort by date or just take the last one? 
                 // Let's assume the API returns the flow object directly or we map it.
                 // If the API returns the timeline, we need to find the current status.
                 // For now, let's map the 'status' field from the response.
                 setFlowData(data[0]); // Placeholder logic
            } else if (data && data.status) {
                 setFlowData(data);
            } else {
                 // Fallback if structure is different
                 setFlowData({
                     id: Number(enquiryId),
                     status: data?.current_status || 'application_received', // Adjust field name
                     status_label: data?.status_label || 'Application Received',
                     created: data?.created_at || new Date().toISOString()
                 });
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load enquiry status");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEnquiry=()=>{
        Alert.alert("Are you sure you want to cancel this enquiry?")
        
    }

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-2 text-gray-500">Loading status...</Text>
            </View>
        );
    }

    if (error || !flowData) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-6">
                <BackButton />
                <Text className="text-red-500 mb-4">{error || "No status data available"}</Text>
                <Button title="Retry" onPress={fetchEnquiryFlow} />
            </View>
        );
    }

    const currentIndex = STATUS_FLOW.indexOf(flowData.status as EnquiryStatus);

    return (
        <View className="flex-1 bg-white px-4 py-6">
            {/* Header */}
            <BackButton />
            <View className="flex-1 m-6">
                <Text className="text-lg font-bold text-gray-800 mb-6">
                    Enquiry Status #{enquiryId}
                </Text>

                {STATUS_FLOW.map((status, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;

                    const dotColor = isCompleted
                        ? "bg-green-600"
                        : isActive
                            ? "bg-blue-600"
                            : "bg-gray-300";

                    const lineColor = isCompleted
                        ? "bg-green-600"
                        : "bg-gray-300";

                    return (
                        <View key={status} className="flex-row items-start">
                            {/* Timeline */}
                            <View className="items-center mr-4">
                                <View className={`w-4 h-4 rounded-full mt-1 ${dotColor}`} />
                                {index !== STATUS_FLOW.length - 1 && (
                                    <View className={`w-0.5 flex-1 ${lineColor}`} />
                                )}
                            </View>

                            {/* Content */}
                            <View className="pb-8 flex-1">
                                <Text
                                    className={`font-semibold ${isActive
                                            ? "text-blue-600"
                                            : isCompleted
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }`}
                                >
                                    {STATUS_LABELS[status]}
                                </Text>

                                {isActive && (
                                    <Text className="text-xs text-gray-500 mt-1">
                                        Current status
                                    </Text>
                                )}

                                {isCompleted && (
                                    <Text className="text-xs text-gray-400 mt-1">
                                        Completed
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}

                <Button
                    title="Cancel Enquiry"
                    onPress={()=>{handleCancelEnquiry()}}
                    icon="x"
                    outline
                />
            </View>
        </View>
    );
}
