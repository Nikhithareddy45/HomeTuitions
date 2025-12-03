import axios from "axios";
import { FormData,TutorData } from "../types/authTypes";
import { base_url } from "../utils/url";


export const registerStudent = async (payload: FormData): Promise<any> => {
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