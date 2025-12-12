import { useRouter } from 'expo-router';
import { CircleArrowLeft } from 'lucide-react-native';
import {
    Text,
    TouchableOpacity
} from 'react-native';

export const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    try {
      if (router.canGoBack()) router.back();
      else console.log("No previous screen to go back to");
    } catch (error) {
      console.log("Back pressed, but navigation failed:", error);
    }
  };

  return (
    <TouchableOpacity
      className="w-auto flex-none rounded-full active:opacity-70"
      onPress={handleBack}
    >
      <CircleArrowLeft color="#115bca" strokeWidth={2} size={26} />
    </TouchableOpacity>
  );
};