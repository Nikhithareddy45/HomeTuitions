export type AvailabilitySection = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type Filters = {
  gender: 'male' | 'female' | 'other' | null;
  teachingLanguages: string[];
  minRating: number | null;
  maxPrice: number | null;
  boards: string[];
  classes: string[];
  educationLevels: string[];
  minExperience: number | null;
  availability: AvailabilitySection[];
  location: string; // street,city,state,pincode,country from backend
};
