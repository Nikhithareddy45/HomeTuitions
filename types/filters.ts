type AvailabilitySection = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type Filters = {
  gender: 'male' | 'female' | 'other' | null;       // radio
  teachingLanguages: string[];                      // multi-select
  minRating: number | null;                         // slider / stars
  maxPrice: number | null;                          // slider / input
  boards: string[];                                 // checkboxes
  classes: string[];                                // checkboxes
  educationLevels: string[];                        // checkboxes
  minExperience: number | null;                     // slider / input
  availability: AvailabilitySection[];              // checkboxes
};