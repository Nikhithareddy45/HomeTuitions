import { getTokenFromStorage } from "@/utils/getUserFromStorage";
import axios from "axios";
import { base_url } from "../utils/url";

export const GetProfileAPI = async (userId: string): Promise<any> => {
  const token = await getTokenFromStorage();
  if (!token) throw new Error("No token found");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };

  const response = await axios.get(`${base_url}/api/users/v1/users/${userId}`, config);
  return response.data;
};

export const UpdateStudentAPI = async (userData: any, userId: string): Promise<any> => {
  const token = await getTokenFromStorage();
  
  if (!token) throw new Error("No token found");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  console.log(config)

  const response = await axios.patch(`${base_url}/api/users/v1/users/${userId}/`, userData, config);
  console.log(response.data)
  return response.data;
};
