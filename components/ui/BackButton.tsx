import { useRouter } from 'expo-router';
import { ArrowLeftFromLine } from "lucide-react-native";
import {
    Text,
    TouchableOpacity
} from 'react-native';

export const BackButton = () => {
    const router = useRouter();
    const handleBack = () => {
        try {
            if (router.canGoBack()) {
                router.back();
            } else {
                console.log("No previous screen to go back to");
            }
        } catch (error) {
            console.log("Back pressed, but navigation failed:", error);
        }
    };
    return (
        <TouchableOpacity
            className='w-10 h-10 rounded-full active:opacity-70 ml-2'
            onPress={handleBack}
        >
            <Text className="text-lg font-5xl text-black py-1">
                <ArrowLeftFromLine color='#ac1e24' strokeWidth={3}/>
            </Text>
        </TouchableOpacity>
    );
};