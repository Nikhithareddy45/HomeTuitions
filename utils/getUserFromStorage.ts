import AsyncStorage from "@react-native-async-storage/async-storage";
import { queryClient } from "./reactQueryClient";

/**
 * Store token in local storage
 */
export const getTokenFromStorage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Error reading token:", error);
    return null;
  }
};

/**
 * Save logged-in user to React Query cache
 */
export const setUserCache = (userData: any, queryClientInstance = queryClient) => {
  try {
    queryClientInstance.setQueryData(["currentUser"], userData);
  } catch (error) {
    console.error("Error setting user cache:", error);
  }
};

/**
 * Clear cached user
 */
export const clearUserCache = (queryClientInstance = queryClient) => {
  try {
    queryClientInstance.removeQueries({ queryKey: ["currentUser"] });
  } catch (error) {
    console.error("Error clearing user cache:", error);
  }
};

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    // 1️⃣ Check React Query cache
    const cachedUser = queryClient.getQueryData<any>(["currentUser"]);
    if (cachedUser) return cachedUser;

    // 2️⃣ Fallback from storage
    const storedUserString = await AsyncStorage.getItem("user");
    if (!storedUserString) return null;

    const storedUser = JSON.parse(storedUserString);
    return storedUser || null;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const getUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};
