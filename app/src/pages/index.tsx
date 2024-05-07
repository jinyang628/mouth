import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { navigateToLinks } from '../../scripts/navigation';
import { post } from '../../scripts/api/entry/_post';
import { useConfig } from '../utils';

function App() {
    const [urls, setUrls] = useState<string[]>([]);
    const config = useConfig();

    useEffect(() => {
        async function fetchData() {
          const result = await chrome.storage.local.get(['shareGptLinks', 'apiKey']);
          if (result.apiKey) {      
            if (result.shareGptLinks && result.shareGptLinks.length > 0) {
              console.log("Retrieved URLs from storage:", result.shareGptLinks);
              setUrls(result.shareGptLinks);
              if (config && config.STOMACH_API_URL) {
                post({ shareGptLinks: result.shareGptLinks, STOMACH_API_URL: config.STOMACH_API_URL, API_KEY: result.apiKey });
              }
            } else {
              console.log("No URLs found, retrying...");
              setTimeout(fetchData, 1000); // Retry after 1 second
            }
          } else {
            alert("API Key is invalid or not set.")
          }
        }
      
        if (config) {
          fetchData();
        }
      }, [config]); // Depend on config as apiKey is checked inside fetchData now
      
    return (
        <div className="App">
            <button onClick={navigateToLinks}>Navigate to Links</button>
            <ul>
                {urls.map((url, index) => (
                    <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);