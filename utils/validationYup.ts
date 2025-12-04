import * as yup from 'yup';

// ============= REGEX PATTERNS =============
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/; // HH:MM format

// ============= INDIVIDUAL FIELD VALIDATIONS =============

/**
 * Username validation
 * Alphanumeric and underscore only, 3-20 characters
 */
export const usernameValidation = yup
  .string()
  .required('Username is required')
  .matches(usernameRegex, 'Username must be 3-20 characters (letters, numbers, underscore only)')
  .trim();

/**
 * Email validation
 */
export const emailValidation = yup
  .string()
  .required('Email is required')
  .matches(emailRegex, 'Invalid email address')
  .lowercase()
  .trim();

/**
 * Password validation
 * Requires: uppercase, lowercase, number, special character, min 8 chars
 */
export const passwordValidation = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 8 characters')
//   .matches(
//     passwordRegex,
//     'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
//   );

/**
 * Confirm password validation
 * Must match password field
 */
export const confirmPasswordValidation = yup
  .string()
  .required('Please confirm your password')
  .oneOf([yup.ref('password')], 'Passwords must match');

/**
 * Mobile number validation
 * Indian phone number (10 digits, starts with 6-9)
 */
export const mobileNumberValidation = yup
  .string()
  .required('Mobile number is required')
  .matches(phoneRegex, 'Mobile number must be a valid 10-digit Indian number (start with 6-9)');

/**
 * Street address validation
 */
export const streetValidation = yup
  .string()
  .required('Street address is required')
  .min(5, 'Street address must be at least 5 characters')
  .max(100, 'Street address must not exceed 100 characters')
  .trim();

/**
 * City validation
 */
export const cityValidation = yup
  .string()
  .required('City is required')
  .min(2, 'City name must be at least 2 characters')
  .max(50, 'City name must not exceed 50 characters')
  .matches(/^[a-zA-Z\s]+$/, 'City must contain only letters')
  .trim();

/**
 * State validation
 */
export const stateValidation = yup
  .string()
  .required('State is required')
  .min(2, 'State name must be at least 2 characters')
  .max(50, 'State name must not exceed 50 characters')
  .matches(/^[a-zA-Z\s]+$/, 'State must contain only letters')
  .trim();

/**
 * Pin code validation
 * 6 digits for Indian postal code
 */
export const pinCodeValidation = yup
  .string()
  .required('Pin code is required')
  .matches(/^\d{6}$/, 'Pin code must be 6 digits');

/**
 * Country validation
 */
export const countryValidation = yup
  .string()
  .required('Country is required')
  .min(2, 'Country name must be at least 2 characters')
  .max(50, 'Country name must not exceed 50 characters')
  .trim();

/**
 * Date of birth validation
 * Must be valid date, not in future, and student must be between 5-100 years old
 */
export const dateOfBirthValidation = yup
  .string()
  .required('Date of birth is required')
  .test('valid-date', 'Invalid date format', (value) => {
    if (!value) return false;
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  })
  .test('not-future', 'Date of birth cannot be in the future', (value) => {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    return date <= today;
  })
  .test('valid-age', 'Student age must be between 5 and 100 years', (value) => {
    if (!value) return false;
    const date = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) 
      ? age - 1 
      : age;
    
    return actualAge >= 5 && actualAge <= 100;
  });

export const subjectsValidation = yup
  .array()
  .of(yup.string().required('Subject cannot be empty'))
  .required('Subjects are required')
  .min(1, 'Please select at least one subject')
  .max(10, 'Maximum 10 subjects allowed');

/**
 * Board validation
 * Array of education boards (CBSE, ICSE, State Board, etc.)
 */
export const boardValidation = yup
  .array()
  .of(yup.string().required('Board cannot be empty'))
  .required('Boards are required')
  .min(1, 'Please select at least one board')
  .max(5, 'Maximum 5 boards allowed');

/**
 * Classes validation
 * Array of classes/grades that tutor teaches
 */
export const classesValidation = yup
  .array()
  .of(yup.string().required('Class cannot be empty'))
  .required('Classes are required')
  .min(1, 'Please select at least one class')
  .max(12, 'Maximum 12 classes allowed');

/**
 * Education qualification validation
 */
export const educationQualificationValidation = yup
  .string()
  .required('Education qualification is required')
  .min(10, 'Qualification must be at least 10 characters')
  .max(200, 'Qualification must not exceed 200 characters')
  .trim();

/**
 * Certificates validation
 * Comma-separated or array of certificate descriptions
 */
export const certificatesValidation = yup
  .string()
  .required('Certificates are required')
  .min(10, 'Certificates information must be at least 10 characters')
  .max(500, 'Certificates information must not exceed 500 characters')
  .trim();

/**
 * Price/Hourly rate validation
 * Must be a positive number
 */
export const priceValidation = yup
  .number()
  .required('Hourly rate is required')
  .typeError('Hourly rate must be a number')
  .positive('Hourly rate must be positive')
  .min(50, 'Hourly rate must be at least ₹50')
  .max(10000, 'Hourly rate must not exceed ₹10,000');

/**
 * Experience validation
 * Years of teaching experience
 */
export const experienceValidation = yup
  .number()
  .required('Experience is required')
  .typeError('Experience must be a number')
  .min(0, 'Experience cannot be negative')
  .max(70, 'Experience cannot exceed 70 years')
  .integer('Experience must be a whole number');

/**
 * Image file validation
 * Optional, but if provided must be image type
 */
export const imageValidation = yup
  .mixed()
  .nullable()
  .test('fileType', 'File must be an image (JPG, PNG, GIF)', (value) => {
    if (!value) return true; // Optional field
    if (value instanceof File) {
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }
    return false;
  })
  .test('fileSize', 'Image size must not exceed 5MB', (value) => {
    if (!value) return true; // Optional field
    if (value instanceof File) {
      return value.size <= 5 * 1024 * 1024; // 5MB
    }
    return false;
  });

/**
 * About/Bio validation
 */
export const aboutValidation = yup
  .string()
  .required('About is required')
  .min(20, 'About must be at least 20 characters')
  .max(1000, 'About must not exceed 1000 characters')
  .trim();

/**
 * Gender validation
 */
export const genderValidation = yup
  .string()
  .required('Gender is required')
  .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender');

/**
 * Language validation
 * Languages the tutor can teach in
 */
export const languageValidation = yup
  .string()
  .required('Language is required')
  .min(2, 'Language must be at least 2 characters')
  .max(50, 'Language must not exceed 50 characters')
  .trim();

/**
 * Day of week validation for availability
 */
export const dayValidation = yup
  .string()
  .required('Day is required')
  .oneOf(
    ['Morning', 'Afternoon','Evening','Night'],
    'Please select a valid section'
  );

/**
 * Time validation (HH:MM format)
 */
export const timeValidation = yup
  .string()
  .required('Time is required')
  .matches(timeRegex, 'Time must be in HH:MM format (00:00 - 23:59)');

/**
 * Start time validation with end time comparison
 */
export const startTimeValidation = yup
  .string()
  .required('Start time is required')
  .matches(timeRegex, 'Start time must be in HH:MM format');

/**
 * End time validation
 * Must be after start time
 */
export const endTimeValidation = yup
  .string()
  .required('End time is required')
  .matches(timeRegex, 'End time must be in HH:MM format')
  .test('endTimeAfterStartTime', 'End time must be after start time', function (value) {
    const { startTime } = this.parent;
    if (!value || !startTime) return true;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = value.split(':').map(Number);
    
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    return endTotalMin > startTotalMin;
  });

// ============= AVAILABILITY WINDOW VALIDATION =============

/**
 * Individual Availability Window validation
 */
export const availabilityWindowSchema = yup.object({
  section: dayValidation,
  start_time: startTimeValidation,
  end_time: endTimeValidation,
});

/**
 * Availabilities array validation
 * At least one availability window required
 */
export const availabilitiesValidation = yup
  .array()
  .of(availabilityWindowSchema)
  .required('At least one availability window is required')
  .min(1, 'Please add at least one availability slot')
  .max(21, 'Maximum 21 availability slots allowed (3 per day)');

export const tutorDataSchema = yup.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  mobile_number: mobileNumberValidation,
  street: streetValidation,
  city: cityValidation,
  state: stateValidation,
  pin_code: pinCodeValidation,
  country: countryValidation,
  subjects: subjectsValidation,
  board: boardValidation,
  classes: classesValidation,
  education_qualification: educationQualificationValidation,
  certificates: certificatesValidation,
  price: priceValidation,
  experience: experienceValidation,
  image: imageValidation,
  availabilities: availabilitiesValidation,
  about: aboutValidation,
  gender: genderValidation,
  language: languageValidation,
});



// ============= HELPER FUNCTIONS =============

/**
 * Extract validation errors from Yup error
 */
export const getValidationErrors = (error: yup.ValidationError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((err) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
  } else if (error.message) {
    errors['general'] = error.message;
  }
  
  return errors;
};
export const validateTutorData = async (data: any, isUpdate = false) => {
  try {
    const schema = isUpdate ? tutorProfileUpdateSchema : tutorDataSchema;
    const validatedData = await schema.validate(data, { abortEarly: false });
    
    return {
      isValid: true,
      errors: {},
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        isValid: false,
        errors: getValidationErrors(error),
        data: null,
      };
    }
    
    return {
      isValid: false,
      errors: { general: 'Validation error occurred' },
      data: null,
    };
  }
};

/**
 * Validate a single field
 */
export const validateField = async (fieldName: string, value: any, schema: yup.ObjectSchema<any>) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: 'Validation error' };
  }
};

/**
 * Validate availability window time overlap
 * Checks if two time windows overlap
 */
export const checkTimeOverlap = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return start1Min < end2Min && start2Min < end1Min;
};

/**
 * Validate no overlapping availabilities for same day
 */
export const validateNoOverlappingAvailabilities = (
  availabilities: any[]
): { isValid: boolean; error?: string } => {
  const availabilitiesByDay: Record<string, any[]> = {};

  // Group by day
  availabilities.forEach((avail) => {
    if (!availabilitiesByDay[avail.section]) {
      availabilitiesByDay[avail.section] = [];
    }
    availabilitiesByDay[avail.section].push(avail);
  });

  // Check for overlaps within each day
  for (const day in availabilitiesByDay) {
    const dayAvailabilities = availabilitiesByDay[day];
    for (let i = 0; i < dayAvailabilities.length; i++) {
      for (let j = i + 1; j < dayAvailabilities.length; j++) {
        const overlap = checkTimeOverlap(
          dayAvailabilities[i].start_time,
          dayAvailabilities[i].end_time,
          dayAvailabilities[j].start_time,
          dayAvailabilities[j].end_time
        );

        if (overlap) {
          return {
            isValid: false,
            error: `Time slots overlap on ${day}`,
          };
        }
      }
    }
  }

  return { isValid: true };
};

// ============= TYPES =============

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: any;
}

/**
 * Field validation result type
 */
export interface FieldValidationResult {
  isValid: boolean;
  error: string | null;
}

// ============= COMPLETE SCHEMAS =============

/**
 * Student Registration Schema
 * Validates complete student registration data (UserData)
 */
export const studentRegistrationSchema = yup.object().shape({
  username: usernameValidation,
  email: emailValidation,
  mobile_number: mobileNumberValidation,
  password: passwordValidation,
  confirm_password: confirmPasswordValidation,
  date_of_birth: dateOfBirthValidation,
  student_class: yup
    .string()
    .required('Student class is required')
    .min(1, 'Student class must be at least 1 character')
    .max(50, 'Student class must not exceed 50 characters')
    .trim(),
  address: yup.object().shape({
    street: streetValidation.nullable(),
    city: cityValidation.nullable(),
    state: stateValidation.nullable(),
    pin_code: pinCodeValidation.nullable(),
    country: countryValidation.nullable(),
  }),
});

/**
 * Login Schema
 * Validates login credentials (LoginData)
 * Can use either username or email with password
 */
export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username or Email is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password cannot be empty'),
});

/**
 * Tutor Registration Schema
 * Validates complete tutor registration data (TutorData)
 */
export const tutorRegistrationSchema = yup.object().shape({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirm_password: confirmPasswordValidation,
  mobile_number: mobileNumberValidation,
  street: streetValidation,
  city: cityValidation,
  state: stateValidation,
  pin_code: pinCodeValidation,
  country: countryValidation,
  subjects: subjectsValidation,
  board: boardValidation,
  classes: classesValidation,
  education_qualification: educationQualificationValidation,
  certificates: yup.string().optional().nullable(),
  price: priceValidation,
  experience: experienceValidation,
  image: imageValidation,
  availabilities: yup
    .array()
    .of(
      yup.object().shape({
        section: dayValidation,
        start_time: timeValidation,
        end_time: timeValidation,
      })
    )
    .optional()
    .nullable(),
  about: aboutValidation,
  gender: genderValidation,
  language: languageValidation,
});

/**
 * Tutor Profile Update Schema
 * Similar to tutorRegistrationSchema but with optional password fields
 */
export const tutorProfileUpdateSchema = yup.object().shape({
  username: usernameValidation,
  email: emailValidation,
  mobile_number: mobileNumberValidation,
  street: streetValidation,
  city: cityValidation,
  state: stateValidation,
  pin_code: pinCodeValidation,
  country: countryValidation,
  subjects: subjectsValidation,
  board: boardValidation,
  classes: classesValidation,
  education_qualification: educationQualificationValidation,
  certificates: yup.string().optional().nullable(),
  price: priceValidation,
  experience: experienceValidation,
  image: imageValidation,
  availabilities: yup
    .array()
    .of(
      yup.object().shape({
        section: dayValidation,
        start_time: timeValidation,
        end_time: timeValidation,
      })
    )
    .optional()
    .nullable(),
  about: aboutValidation,
  gender: genderValidation,
  language: languageValidation,
});

/**
 * Student Profile Update Schema
 * For updating student profile information
 */
export const studentProfileUpdateSchema = yup.object().shape({
  username: usernameValidation,
  email: emailValidation,
  mobile_number: mobileNumberValidation,
  date_of_birth: dateOfBirthValidation,
  student_class: yup
    .string()
    .required('Student class is required')
    .min(1, 'Student class must be at least 1 character')
    .max(50, 'Student class must not exceed 50 characters')
    .trim(),
  address: yup.object().shape({
    street: streetValidation.nullable(),
    city: cityValidation.nullable(),
    state: stateValidation.nullable(),
    pin_code: pinCodeValidation.nullable(),
    country: countryValidation.nullable(),
  }),
});

/**
 * Password Change Schema
 * For changing password with old password verification
 */
export const passwordChangeSchema = yup.object().shape({
  old_password: yup
    .string()
    .required('Current password is required')
    .min(1, 'Current password cannot be empty'),
  new_password: passwordValidation,
  confirm_password: confirmPasswordValidation,
});