
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
    const token = getTokenFromStorage();

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
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};

export const ApplicationsAPI = async (ApplicationData: any,tutorId: string): Promise<any> => {
  try {
    const token = getTokenFromStorage(); 
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