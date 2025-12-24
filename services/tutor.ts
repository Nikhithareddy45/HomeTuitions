import { base_url } from '@/utils/url';
import axios from 'axios';
import { getTokenFromStorage } from '@/utils/getUserFromStorage';

export const getTutorByIdAPI = async (tutorId: string): Promise<any> => {
  try {
    const response = await axios.get(`${base_url}/api/tutors/v1/tutors/${tutorId}/`, {
    });
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};
export const getAllTutorsAPI = async (): Promise<any> => {
  try {
    const response = await axios.get(`${base_url}/api/tutors/v1/tutors/`, {
    });
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  } 
}
export const getAcceptedAPI = async (): Promise<any> => {
      try {
        const token = getTokenFromStorage();
      const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
        const response = await axios.get(`${base_url}/api/demoapp/v1/demoapp/?status=accepted`,
          config,
          );
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};
export const getRejectedAPI = async (): Promise<any> => {
      try {
        const token = getTokenFromStorage();
      const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
        const response = await axios.get(`${base_url}/api/demoapp/v1/demoapp/?status=rejected`,
          config,
          );
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};
export const getPendingAPI = async (): Promise<any> => {
      try {
        const token = getTokenFromStorage();
      const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
        const response = await axios.get(`${base_url}/api/demoapp/v1/demoapp/?status=pending`,
          config,
          );
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};