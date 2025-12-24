import { Address,AvailabilityWindow } from "./common";
export interface UserData {
  username: string;
  email: string;
  mobile_number: string;
  date_of_birth?: string | null;
  student_class?: string | null;
  profile_image?: string | null;
  address?: Address | null;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface TutorData {
  username: string;
  email: string;
  password: string;
  mobile_number: string;
  street: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  subjects: string[];
  board: string[];
  classes: string[];
  education_qualification: string;
  certificates: string;
  price: number;
  experience: number;
  image: File | null;
  availabilities: AvailabilityWindow[];
  about: string;
  gender: string;
  language: string;
}

