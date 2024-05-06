import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Options = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    // On mount, load the API key from storage
    chrome.storage.local.get(['apiKey'], function(result) {
      if (result.apiKey) {
        setApiKey(result.apiKey);
      }
    });
  }, []);

  const handleApiKeyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setApiKey(event.target.value);
  };

  const saveApiKey = () => {
    chrome.storage.local.set({ apiKey: apiKey }, () => {
      alert('API Key saved!');
    });
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

ReactDOM.render(<Options />, document.getElementById('root'));
