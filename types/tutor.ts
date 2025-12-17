import { Address, AvailabilityWindow } from "./common";

export interface TutorUser {
  id: number;
  username: string;
  email: string;
  mobile_number: string;
  address: Address;
}
export interface GetAllTutorData {
  id: number;
  user: TutorUser;
  subjects: string[];
  board: string[];
  classes: string[];
  education_qualification: string;
  certificates: string | null;
  image: string | null;
  availabilities: AvailabilityWindow[];
  about: string;
  price: number | null;
  experience: number | null;
  gender: string | null;
  language: string | null;
  account_type: string;
}
