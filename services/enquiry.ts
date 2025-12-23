import { getTokenFromStorage } from "@/utils/getUserFromStorage";
import axios, { AxiosError } from "axios";
import { base_url } from "@/utils/url";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EnquiryData } from "../types/enquiry";

export const getMyEnquiriesAPI = async (): Promise<any> => {
  try {
    const token = await getTokenFromStorage();
    
    if (!token) {
      console.log("No authentication token found. Redirecting to login...");
      // Redirect to login if no token
      router.replace("/(auth)/login");
      throw new Error("Authentication required");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const response = await axios.get(
      `${base_url}/api/enquiry/v1/enquiry/myapplications`,
      config
    );
    
    return response.data;
  } catch (error: any) {
    console.error("Enquiry API error:", error.message);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/login");
      }
      
      // Throw a more descriptive error
      throw new Error(
        "Failed to fetch enquiries. Please try again."
      );
    }
    
    throw new Error("An unexpected error occurred. Please try again later.");
  }
};

export const sendEnquiryAPI = async (data: EnquiryData): Promise<any> => {
  try {
    const token = await getTokenFromStorage();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `${base_url}/api/enquiry/v1/enquiry/`,
      data,
      config
    );
    console.log("Offline api data",response.data)
    return response.data;
  } catch (error: any) {
    console.log("API error response:", error);
    throw error;
  }
};