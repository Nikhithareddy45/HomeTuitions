import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook to reset form state when page comes into focus
 * Useful for cleaning up form data when user navigates back to a page
 */
export const useFormReset = (resetCallback: () => void) => {
  useFocusEffect(
    useCallback(() => {
      resetCallback();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );
};
