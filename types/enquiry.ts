

export interface EnquiryAPI {
  id: number;
  user: number;
  user_username: string;
  board: string[];
  classes: string[];
  subjects: string[];
  email: string;
  mobile_number: string;
  home_address: string;
  teaching_language: string;
  teaching_section: string;
  teaching_starttime: string;
  teaching_endtime: string;
  student_class: string;
  minimum_price: number;
  maximum_price: number;
  message: string;
  status: TutorAction;
  is_tutor_allocated: boolean;
  tutor_allocated: number | null;
  created: string;
}

export interface EnquiryData {
  username: string;
  email: string;
  mobileNumber: string;
  address: string;
  boards: string[];
  classes: string[];
  subjects: string[];
  teachingLanguage: string;
  teachingSection: string;
  startTime: string;
  endTime: string;
  minPrice: string;
  maxPrice: string;
  additionalMessage: string;
  [key: string]: any;
}

export type TutorAction = 'accepted' | 'rejected' | 'pending';

export type TutorStatus =
  | 'application_received'
  | 'tutor_sent'
  | 'demo_requested'
  | 'demo_completed'
  | 'tutor_finalized'
  | 'cancelled';

export interface TutorSelection {
  tutorId: number;
  tutorName: string;
  checked: boolean;
  action: TutorAction;
  status: TutorStatus;
}
export interface FlowItem {
  enquiryId: number;
  status_label: TutorStatus;
  createdAt: string;
}

export interface EnquiryRound {
  round: number;
  tutors: TutorSelection[];
}
