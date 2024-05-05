import React, { useState, useEffect } from 'react';
import { navigateToLinks } from '../scripts/navigation';

const App = () => {
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
      function fetchData() {
          chrome.storage.local.get(['shareGptLinks'], function(result) {
              if (result.shareGptLinks) {
                  console.log("Retrieved URLs from storage:", result.shareGptLinks);
                  setUrls(result.shareGptLinks);
              } else {
                  console.log("No URLs found, retrying...");
                  setTimeout(fetchData, 1000); // Retry after 1 second
              }
          });
      }
      fetchData();

      return () => {
          chrome.storage.local.remove(['shareGptLinks']);
      };
    }, []);

    return (
        <div className="App">
            <button onClick={navigateToLinks}>Navigate to Links</button>
            <ul>
                {urls.map((url, index) => (
                    <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                ))}
            </ul>
        </div>
    );
};

export default App;
