import { getTokenFromStorage } from "@/utils/getUserFromStorage";
import axios from "axios";
import { base_url } from "../utils/url";
import { UserData } from "../types/authTypes";

export const GetProfileAPI = async (userId: string): Promise<any> => {
  const token = await getTokenFromStorage();
  if (!token) throw new Error("No token found");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };

  const response = await axios.get(`${base_url}/api/users/v1/users/${userId}`, config);
  return response.data;
};

export const UpdateStudentAPI = async (userData: UserData, userId: string): Promise<any> => {
  try {
    const token = await  getTokenFromStorage();
    const config = {
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.patch(`${base_url}/api/users/v1/users/${userId}/`, userData, config);
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};
export const AddressAPI = async (userData: any, userId: string): Promise<any> => {
  try {
    const token = await getTokenFromStorage(); 
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    
    const response = await axios.patch(
      `${base_url}/api/users/v1/addresses/${userId}/`, 
      userData, 
      config
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
