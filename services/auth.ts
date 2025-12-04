import axios from "axios";
import { UserData,TutorData,LoginData } from "../types/authTypes";
import { base_url } from "../utils/url";


export const registerStudent = async (payload: UserData): Promise<any> => {
  try { 
    console.log("payload", payload )
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post(
      `${base_url}/api/users/v1/auth/register/`,
      payload,
      config
    );
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};
export const registerTutor = async (payload: TutorData): Promise<any> => {
  try { 
    console.log("payload", payload )
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post(
      `${base_url}/api/tutors/v1/auth/register/`,
      payload,
      config
    );
    console.log(response.data)
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};
export const LoginAPI = async ({ username, password }: LoginData): Promise<any> => {
  try {   
    const response = await axios.post(`${base_url}/api/users/v1/auth/login/`,{ username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};