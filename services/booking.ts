
export interface BookDemoData {
  tutorId: string;
  message: string;
  demoDate: string; // ISO date or yyyy-mm-dd
  demoTime: string; // free text like "Evening 5PM"
}

import { getTokenFromStorage } from "@/utils/getUserFromStorage";
import axios from "axios";
import { base_url } from "../utils/url";
export const BookDemoAPI = async ({ tutorId, message, demoDate, demoTime }: BookDemoData): Promise<any> => {
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
      `${base_url}/api/demoapp/v1/demoapp/`,
      { tutor_id: tutorId, message, demo_date: demoDate, demo_time: demoTime },
      config
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
    const token = await getTokenFromStorage(); 
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.post(
      `${base_url}/api/demoapp/v1/demoapp/`,
      { tutor_id: tutorId, ...ApplicationData },
      config
    );
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};  
export const getAcceptedAPI = async (): Promise<any> => {
      try {
        const token = await getTokenFromStorage();
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

export const getPendingAPI = async (): Promise<any> => {
      try {
        const token = await getTokenFromStorage();
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


export const GetMyApplicationsAPI = async (): Promise<any> => {
  try {
    const token = await getTokenFromStorage();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
    const response = await axios.get(
      `${base_url}/api/demoapp/v1/demoapp/`,
      config
    );
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const getRejectedAPI = async (): Promise<any> => {
      try {
        const token = await getTokenFromStorage();
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