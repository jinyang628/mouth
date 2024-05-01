import React, { useEffect, useState } from 'react';
import { navigateToLinks } from '../scripts/navigation';
import { readFromClipboard } from '../scripts/clipboard';

const App = () => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    const handleMessage = async (request: { action: string }, sender: any, sendResponse: (response: { clipboardContent?: string; error?: any }) => void) => {
      if (request.action === 'readClipboard') {
        try {
          const text = await readFromClipboard();
          setUrl(text);
          sendResponse({clipboardContent: text});
        } catch (error: any) {
          console.error('Error reading from clipboard:', error);
          sendResponse({error: error.message});
        }
      }
      return true; // To indicate that we will answer asynchronously
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <button onClick={navigateToLinks}>Navigate to Links</button>
      {url && <p>Retrieved URL: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>}
    </div>
  );
};

export default App;
