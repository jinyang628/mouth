import React, { useState, useEffect } from 'react';
import { navigateToLinks } from '../scripts/navigation';
import { post } from '../scripts/api/entry/_post';

interface Config {
  STOMACH_API_URL: string;
}

const App = () => {
    const [urls, setUrls] = useState<string[]>([]);
    const [config, setConfig] = useState<Config | null>(null);
    const [apiKey, setApiKey] = useState('');  // State to store the API key entered by the user
    const [inputApiKey, setInputApiKey] = useState('');  // Temporary input state for API key

    // Load configuration on mount
    useEffect(() => {
      fetch(chrome.runtime.getURL('config.json'))
          .then((response) => response.json())
          .then((json) => {
              setConfig(json as Config);  // Cast the JSON to Config
              console.log('Configuration loaded:', json);
          })
          .catch((error) => console.error('Error loading the configuration:', error));

      // Load the API key from storage
      chrome.storage.local.get(['apiKey'], function(result) {
          if (result.apiKey) {
              setApiKey(result.apiKey);
          }
      });
    }, []);

    // Fetch data depending on configuration
    useEffect(() => {
        if (config && apiKey) {
            function fetchData() {
                chrome.storage.local.get(['shareGptLinks'], function(result) {
                    if (result.shareGptLinks && result.shareGptLinks.length > 0) {
                        console.log("Retrieved URLs from storage:", result.shareGptLinks);
                        setUrls(result.shareGptLinks);
                        if (config && config.STOMACH_API_URL) {
                            post({ shareGptLinks: result.shareGptLinks, STOMACH_API_URL: config.STOMACH_API_URL, API_KEY: apiKey });
                        }
                    } else {
                        console.log("No URLs found, retrying...");
                        setTimeout(fetchData, 1000); // Retry after 1 second
                    }
                });
            }
            fetchData();
        }
    }, [config, apiKey]);  // Depend on apiKey as well to re-run the effect when it changes

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

export default App;
