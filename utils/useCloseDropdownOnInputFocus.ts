import { useEffect } from 'react';

/**
 * Custom hook to manage dropdown closing when inputs are focused
 * This works by using a shared state that components can subscribe to
 */

let dropdownCloseListeners: Array<() => void> = [];

export const registerDropdownCloseListener = (callback: () => void) => {
  dropdownCloseListeners.push(callback);
  return () => {
    dropdownCloseListeners = dropdownCloseListeners.filter(cb => cb !== callback);
  };
};

export const triggerDropdownClose = () => {
  dropdownCloseListeners.forEach(callback => callback());
};

export const useCloseDropdownOnInputFocus = (onClose: () => void) => {
  useEffect(() => {
    const unregister = registerDropdownCloseListener(onClose);
    return unregister;
  }, [onClose]);
};
