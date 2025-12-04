import { useEffect, useState } from 'react';
import { base_url } from './url';

/**
 * Hook to handle tutor image display
 * Converts backend image paths to full URLs
 */
export const useTutorImage = (imagePath: string | null | undefined) => {
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    if (!imagePath) {
      setImageUri(undefined);
      return;
    }

    // If it's already a full URL, use as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      setImageUri(imagePath);
      return;
    }

    // Otherwise, prepend base URL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    setImageUri(`${base_url}${cleanPath}`);
  }, [imagePath]);

  return imageUri;
};

/**
 * Hook to handle student image display
 * Similar to useTutorImage but for student profiles
 */
export const useStudentImage = (imagePath: string | null | undefined) => {
  const [imageUri, setImageUri] = useState<string | undefined>();

  useEffect(() => {
    if (!imagePath) {
      setImageUri(undefined);
      return;
    }

    // If it's already a full URL, use as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      setImageUri(imagePath);
      return;
    }

    // Otherwise, prepend base URL
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    setImageUri(`${base_url}${cleanPath}`);
  }, [imagePath]);

  return imageUri;
};
