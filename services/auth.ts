import axios from "axios";
import { FormData } from "../types/authTypes";
import { base_url } from "../utils/url";

export interface StudentRegistrationPayload {
  username: string;
  email: string;
  mobile_number: string;
  date_of_birth: string;
  student_class: string;
}

export const registerStudent = async (payload: StudentRegistrationPayload): Promise<any> => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.post(
      `${base_url}/api/users/v1/auth/register/`,
      payload,
      config
    );
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const UserAPI = async (userData: FormData): Promise<any> => {
  try {
    const config: any = {};
    if (userData instanceof FormData) {
      config.headers = { "Content-Type": "multipart/form-data" };
    } else {
      config.headers = { "Content-Type": "application/json" };
    }
    const response = await axios.post(`${base_url}/api/users/v1/auth/register/`, userData, config);
    return response.data;
  } catch (error: any) {
    console.error("API error response:", error.response?.data);
    throw error;
  }
};