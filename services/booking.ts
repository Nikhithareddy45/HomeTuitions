
import apiClient from "./apiClient";

export interface BookDemoData {
  tutor_id: number;
  contact_name: string;
  contact_email: string;
  contact_mobile: string;
  demo_date: string;
  demo_time: string;
  message: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pin_code: string;
  };
}

export const BookDemoAPI = async (payload: BookDemoData): Promise<any> => {
  try {
    console.log(payload)
    const response = await apiClient.post(
      '/api/demoapp/v1/demoapp/',
      payload
    );
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const ApplicationsAPI = async (ApplicationData: any, tutorId: string): Promise<any> => {
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

