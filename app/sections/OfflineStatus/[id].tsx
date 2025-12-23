import { BackButton } from "@/components/ui/BackButton";
import React from "react";
import { View, Text } from "react-native";

const FLOW_STEPS = [
  { key: "application_received", label: "Application\nReceived" },
  { key: "tutors_sent", label: "Tutors\nSent" },
  { key: "demo_requested", label: "Demo\nRequested" },
  { key: "demo_completed", label: "Demo\nCompleted" },
  { key: "tutor_finalized", label: "Tutor\nFinalized" },
];

interface FlowItem {
  status: string;
  created?: string;
  created_at?: string;
} 

interface Props {
  flowData: FlowItem[];
}

const EnquiryFlowStepper: React.FC<Props> = ({ flowData }) => {
  if (!Array.isArray(flowData) || flowData.length === 0) {
    return (
      <View className="m-6 flex-1">
        <BackButton/>
        <View className="flex-1 items-center justify-center">
          <Text className="mb-6 text-sm text-gray-500 text-center">
        Application flow will appear once processing starts.
        </Text>
        </View>
      </View>
    );
  }

  // ✅ Safe timestamp resolver
  const getTime = (item: FlowItem) =>
    new Date(item.created_at || item.created || "").getTime();

  // ✅ Sort oldest → newest
  const sortedFlow = [...flowData].sort(
    (a, b) => getTime(a) - getTime(b)
  );

  const lastStatus = sortedFlow[sortedFlow.length - 1]?.status;

  const completedStepIndex = FLOW_STEPS.findIndex(
    (step) => step.key === lastStatus
  );

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between">
        {FLOW_STEPS.map((step, index) => {
          const isCompleted = index <= completedStepIndex;

          return (
            <View key={step.key} className="flex-1 items-center">
              {/* DOT */}
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  isCompleted ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isCompleted ? "text-white" : "text-gray-600"
                  }`}
                >
                  {index + 1}
                </Text>
              </View>

              {/* LABEL */}
              <Text className="text-xs text-center mt-2 text-gray-700">
                {step.label}
              </Text>

              {/* CONNECTOR */}
              {index !== FLOW_STEPS.length - 1 && (
                <View
                  className={`absolute top-3 left-1/2 right-[-50%] h-1 ${
                    index < completedStepIndex
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default EnquiryFlowStepper;
