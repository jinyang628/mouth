// App.tsx or wherever your component is defined
import React, { useEffect, useState } from 'react';
import { retrieveUrls } from './scripts/start';
import { readFromClipboard } from './scripts/clipboard';

const App = () => {
  const [url, setUrl] = useState<string>(''); // State to store the retrieved URL


  useEffect(() => {
    const handleMessage = (request: { action: string; }, sender: any, sendResponse: (arg0: { clipboardContent?: string; error?: any; }) => void) => {
      if (request.action === 'readClipboard') {
        readFromClipboard().then(text => {
          setUrl(text); 
          sendResponse({clipboardContent: text});
        }).catch(error => {
          sendResponse({error: error.message});
        });
      }
      return true; // to indicate that we will answer asynchronously
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <button onClick={retrieveUrls}>Retrieve URLs</button>
      {url && <p>Retrieved URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>}
    </div>
  );
};

export default App;
