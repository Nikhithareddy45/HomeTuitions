
export interface FormData {
  username: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  student_class: string;
  address: Address;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface TutorData {
  username: string;
  email: string;
  mobile_number: string;
  password: string;
  confirm_password: string;
  address: Address;
  subjects?: string[];
  board?: string[];
  classes?: string[];
  education_qualification?: string;
  certificates?: string;
  image?: string;
  availabilities?: AvailabilityWindow[];
  about?: string;
  rating?: number;  
  reviews?: number;
  gender?: string;
  language?: string;
  price?: number;
  experience?: number | string;
}

export interface AvailabilityWindow {
  section: string;
  start_time: string;
  end_time: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
}