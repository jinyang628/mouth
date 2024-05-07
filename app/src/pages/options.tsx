import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { validate } from '../../scripts/api/user/validate';
import { useConfig } from '../utils';

interface Config {
    STOMACH_API_URL: string;
}

function Options() {
  const [apiKey, setApiKey] = useState('');
  const config = useConfig();

  useEffect(() => {
    // Load the API key from storage
    chrome.storage.local.get(['apiKey'], function(result) {
        if (result.apiKey) {
            setApiKey(result.apiKey);
        }
    });
  }, []);

  const handleApiKeyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = async () => {
    try {
      const response = await validate({ apiKey: apiKey, STOMACH_API_URL: config!.STOMACH_API_URL });
      if (response.status !== 200) {
        throw new Error('Invalid API key');
      }
      chrome.storage.local.set({ apiKey: apiKey }, () => {
        alert('API Key saved!');
      });
    } catch (error) {
      alert('Invalid API Key');
    }
  };

  return (
    <div>
      <h1>Still Human</h1>
      <input
        type="text"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter API Key"
      />
      <button onClick={saveApiKey}>Save API Key</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);