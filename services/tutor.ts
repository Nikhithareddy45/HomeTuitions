import { base_url } from '@/utils/url';
import axios from 'axios';

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