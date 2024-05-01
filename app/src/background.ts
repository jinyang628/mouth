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
    } else if (message.action === "clipboardContent") {

        // THERE IS A DIFFERENCE BETWEEN chrome.tabs.sendMessage and chrome.runtime.sendMessage (ONE SENDS TO BACKGROUND AND OTHER SENDS TO CONTENT, check how to handle the flow)
        // if (chrome.extension.getBackgroundPage() === window) {
        //     console.log("This is the background script.");
        //     return true;
        // } else {
        //     console.log("This is not the background script.");
        //     return false;
        // }

    
      const shareGptLink: string = message.content;
      chrome.storage.local.get(['tabId'], function(result) {
        if (!chrome) {
            console.error("Chrome not found in window.");
            sendResponse({status: "error", message: "chrome not found in window."});
        }
        if (!chrome.tabs) {
            console.error("Chrome tabs not found in window.");
            sendResponse({status: "error", message: "chrome tabs not found in window."});
        }
        if (result.tabId) {
            chrome.tabs.sendMessage(result.tabId, { action: "updateShareGptLinkList", link: shareGptLink }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to tab:", chrome.runtime.lastError.message);
                    sendResponse({status: "error", message: "chrome not found in window."});
                } else {
                    console.log("Message sent successfully");
                    sendResponse({status: "success"});

                }
            });
        } else {
            console.error("Tab ID not found in storage:", result);
            sendResponse({status: "error", message: "tab ID not found in storage."});
        }
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
                action: "clipboardContent",
                content: message.content
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