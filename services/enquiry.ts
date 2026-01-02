import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { EnquiryData } from "../types/enquiry";
import apiClient from "./apiClient";

export const getMyEnquiriesAPI = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/api/enquiry/v1/enquiry/myapplications');
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

export const getEnquiryFlowStatusAPI = async (enquiryId: number | string): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/enquiry/v1/enquiry-flow/?enquiry=${enquiryId}`);
    return response.data;
  } catch (error: any) {
    console.log("API error response:", error);
    throw error;
  }
};

export const sendEnquiryAPI = async (data: EnquiryData): Promise<any> => {
  try {
    const response = await apiClient.post('/api/enquiry/v1/enquiry/', data);
    console.log("Offline api data",response.data)
    return response.data;
  } catch (error: any) {
    console.log("API error response:", error);
    throw error;
  }
};
