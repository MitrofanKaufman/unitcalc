import { useState, useEffect } from 'react';

/**
 * Custom hook to check the health of the backend API
 * @returns An object containing the health status and error state
 */
export function useBackendHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIsHealthy(data.status === 'ok');
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check backend health'));
        setIsHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(checkHealth, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return { isHealthy, isLoading, error };
}
