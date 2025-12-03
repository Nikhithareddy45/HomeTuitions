// Validation utilities for form fields

export const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return undefined;
};

export const validateUsername = (username: string): string | undefined => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be at most 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return undefined;
};

export const validateMobileNumber = (mobile: string): string | undefined => {
  if (!mobile) return 'Mobile number is required';
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile.replace(/\D/g, ''))) return 'Mobile number must be 10 digits';
  return undefined;
};

export const validateDateOfBirth = (dob: string): string | undefined => {
  if (!dob) return 'Date of birth is required';
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  
  if (age < 5) return 'You must be at least 5 years old';
  if (age > 100) return 'Invalid date of birth';
  return undefined;
};

export const validateStudentClass = (studentClass: string): string | undefined => {
  if (!studentClass) return 'Student class is required';
  if (studentClass.length < 1) return 'Student class is required';
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return 'Confirm password is required';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
};
