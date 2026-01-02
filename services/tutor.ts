import apiClient from "./apiClient";

export const getTutorByIdAPI = async (tutorId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/api/tutors/v1/tutors/${tutorId}/`);
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const getAllTutorsAPI = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/api/tutors/v1/tutors/');
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  } 
};
