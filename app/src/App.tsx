// App.tsx or wherever your component is defined
import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const handleMessage = (request: { action: string; }, sender: any, sendResponse: (arg0: { clipboardContent?: string; error?: any; }) => void) => {
      if (request.action === 'readClipboard') {
        readFromClipboard().then(text => {
          sendResponse({clipboardContent: text});
        }).catch(error => {
          console.error('Error reading clipboard:', error);
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

  const readFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      console.log('Clipboard content:', text);
      return text;
    } catch (error) {
      console.error('Failed to read from clipboard:', error);
      throw error; // to handle it in the message response
    }
  };

  const triggerContentScript = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      // Ensure there is an active tab to send a message to
      if (tabs.length && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "triggerManageLinks" });
      }
    });
  };

  return (
    <div className="App">
      <button onClick={triggerContentScript}>Retrieve URLs</button>
    </div>
  );
};

export default App;
