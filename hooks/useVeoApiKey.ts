
import { useState, useCallback, useEffect } from 'react';

export const useVeoApiKey = () => {
  const [isKeyReady, setIsKeyReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = useCallback(async () => {
    setIsChecking(true);
    try {
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setIsKeyReady(true);
      } else {
        setIsKeyReady(false);
      }
    } catch (error) {
      console.error("Error checking for API key:", error);
      setIsKeyReady(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const promptForKey = useCallback(async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        // Assume success after prompt closes to avoid race conditions.
        // The next API call will validate the key.
        setIsKeyReady(true);
      }
    } catch (error) {
      console.error("Error opening API key selection:", error);
      setIsKeyReady(false);
    }
  }, []);

  const handleApiError = useCallback((error: any) => {
    if (error?.message?.includes("Requested entity was not found")) {
      console.warn("API key seems invalid. Resetting key state.");
      setIsKeyReady(false);
    }
  }, []);

  useEffect(() => {
    checkKey();
  }, [checkKey]);

  return { isKeyReady, isChecking, promptForKey, checkKey, handleApiError };
};
