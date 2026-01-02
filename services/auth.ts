import apiClient from "./apiClient";
import { UserData, TutorData, LoginData } from "../types/authTypes";

export const registerStudent = async (payload: UserData): Promise<any> => {
  try { 
    const response = await apiClient.post(
      '/api/users/v1/auth/register/',
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const registerTutor = async (payload: TutorData): Promise<any> => {
  try { 
    const response = await apiClient.post(
      '/api/tutors/v1/auth/register/',
      payload
    );
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const LoginAPI = async ({ username, password }: LoginData): Promise<any> => {
  try {   
    const response = await apiClient.post('/api/users/v1/auth/login/',
      { username, password },
      {
        withCredentials: false,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

