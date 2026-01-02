import apiClient from "./apiClient";
import { UserData } from "../types/authTypes";

export const GetProfileAPI = async (userId: string): Promise<any> => {
  const response = await apiClient.get(`/api/users/v1/users/${userId}`);
  return response.data;
};

export const UpdateStudentAPI = async (userData: UserData, userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/api/users/v1/users/${userId}/`, userData);
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const AddressAPI = async (userData: any, userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(
      `/api/users/v1/addresses/${userId}/`,
      userData
    );

    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    console.error("Error details:", {
      message: error.message,
      status: error.response?.status,
      headers: error.config?.headers,
    });
    throw error;
  }
};
