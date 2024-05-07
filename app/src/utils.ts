import { useState, useEffect } from 'react';

interface Config {
  STOMACH_API_URL: string;
}

// Custom hook for fetching and returning configuration
export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    fetch(chrome.runtime.getURL('config.json'))
      .then((response) => response.json())
      .then((json) => {
        setConfig(json as Config);  // Cast the JSON to Config
        console.log('Configuration loaded:', json);
      })
      .catch((error) => console.error('Error loading the configuration:', error));
  }, []);

  return config;
}
