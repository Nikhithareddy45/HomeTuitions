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


export interface Address {
  street?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  country?: string;
}