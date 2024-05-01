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
        chrome.storage.local.set({ originalTabId: message.originalTabId });
        chrome.tabs.create({ url: appendedUrl }, (newTab) => {
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if (tabId === newTab.id && changeInfo.status === "complete") {
                    console.log("Tab loaded:", tab.url);
                }
            })
        });
    } else if (message.action === "sendClipboardContent") {
        chrome.storage.local.get(['originalTabId'], function(result) {
        const originalTabId = result.originalTabId;
        if (!originalTabId) {
            console.error("Original tab ID not found in storage:", result);
            sendResponse({status: "error"});
            return;
        }
        chrome.tabs.update(originalTabId, {active: true}, function(tab) {
            const messageObject = {
                action: "updateShareGptLinkList",
                link: message.content
            };
            chrome.tabs.sendMessage(originalTabId, messageObject, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to original tab:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully to original tab.");
                    sendResponse({ status: "success" });
                }
            });
        });
      });
    }
    return true; // Indicates to Chrome that sendResponse will be called asynchronously
});