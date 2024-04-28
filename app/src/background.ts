chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'triggerManageLinks') {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // Ensure there is an active tab to send a message to
          if (tabs.length && tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "manageLinks" });
          }
      }
    )}
});