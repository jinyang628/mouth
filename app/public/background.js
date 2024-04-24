chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'triggerReadClipboard') {
      // This message tells the background to ask the React app to read the clipboard
      // Forward the request to the React app's window
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "readClipboard"});
      });
      return true; // indicates that the response is sent asynchronously
    }
  });