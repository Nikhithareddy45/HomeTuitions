import React from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButton } from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
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

/* =======================
   Status Config
======================= */

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

/* =======================
   Dummy Data (per enquiry)
======================= */

const DUMMY_FLOW_DATA: EnquiryFlowUI[] = [
    {
        id: 16,
        status: "tutors_sent",
        status_label: "Tutors Sent",
        created: "2025-12-28T14:06:20Z",
    },
];

export default function EnquiryStatusScreen() {
    const { enquiryId } = useLocalSearchParams<{ enquiryId: string }>();
    console.log("flow enquiry id", enquiryId);
    const flow = DUMMY_FLOW_DATA[0];
    const currentIndex = STATUS_FLOW.indexOf(flow.status);

    const handleCancelEnquiry=()=>{
        Alert.alert("Are you sure you want to cancel this enquiry?")
        
    }

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
