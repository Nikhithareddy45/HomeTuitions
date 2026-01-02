
import apiClient from "./apiClient";

export interface BookDemoData {
  tutorId: string;
  message: string;
  demoDate: string; // ISO date or yyyy-mm-dd
  demoTime: string; // free text like "Evening 5PM"
}

export const BookDemoAPI = async ({ tutorId, message, demoDate, demoTime }: BookDemoData): Promise<any> => {
  try {
    console.log({ tutorId, message, demoDate, demoTime })

    const response = await apiClient.post(
      '/api/demoapp/v1/demoapp/',
      { tutor_id: tutorId, message, demo_date: demoDate, demo_time: demoTime }
    );
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const ApplicationsAPI = async (ApplicationData: any,tutorId: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      '/api/demoapp/v1/demoapp/',
      { tutor_id: tutorId, ...ApplicationData }
    );
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};  
export const getAcceptedAPI = async (): Promise<any> => {
      try {
        const response = await apiClient.get('/api/demoapp/v1/demoapp/?status=accepted');
          
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};

export const getPendingAPI = async (): Promise<any> => {
      try {
        const response = await apiClient.get('/api/demoapp/v1/demoapp/?status=pending');
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};


export const GetMyApplicationsAPI = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/api/demoapp/v1/demoapp/');
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const getRejectedAPI = async (): Promise<any> => {
      try {
        const response = await apiClient.get('/api/demoapp/v1/demoapp/?status=rejected');
        return response.data;
      } catch (error: any) {
        console.log("API error response:", error);
        throw error;
      } 
};

