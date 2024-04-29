import { processTabUrl } from "../scripts/navigation";

export const NAVIGATION_MARKER: string = "##still-human##";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'triggerNavigateToLinks') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0].id) {
          console.error("No tab ID found in query response.");
          return;
        }
        const tabId: number = tabs[0].id;
        chrome.storage.local.set({ tabId: tabId });
        chrome.tabs.sendMessage(tabId, { action: "getLink", originalTabId: tabId});
      });
    } else if (message.action === "navigateToLink") {
        const appendedUrl: string = message.url + NAVIGATION_MARKER + message.originalTabId;
        chrome.storage.local.set({ tabUrl: appendedUrl });
        chrome.tabs.create({ url: appendedUrl });
    } else if (message.action === "clipboardContent") {
      const shareGptLink: string = message.content;
      console.error("Clipboard content received:", shareGptLink);
      chrome.storage.local.get(['tabId'], function(result) {
        if (result.tabId) {
            console.error("Tab ID found in storage:", result.tabId);
            chrome.tabs.sendMessage(result.tabId, { action: "updateShareGptLinkList", link: shareGptLink }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to tab:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully");
                }
            });
        } else {
            console.error("Tab ID not found in storage:", result);
        }
    }); 
    } else if (message.action === "sendClipboardContent") {
      chrome.storage.local.get(['tabUrl'], function(result) {
          const originalTabId = processTabUrl(result.tabUrl);
          chrome.tabs.sendMessage(originalTabId, { action: "clipboardContent", content: message.content });
          sendResponse({status: "success"});
      });
      return true; // Indicates to Chrome that sendResponse will be called asynchronously
    }
});