import { PopulateChatlogLinksMessage, NavigateToLinksMessage, SendClipboardContentMessage, UpdateShareGptLinkListMessage } from "./types/messages";

export const NAVIGATION_MARKER: string = "##still-human##";

let linkCounter: number = 0;
let shareGptLinks: string[] = [];
let chatlogLinks: string[] = [];
let lastCreatedTabId: number | undefined = undefined;
let navigateTimer: number | null | undefined  = null;

function resetNavigationTimer() {
    if (navigateTimer) {
        clearTimeout(navigateTimer);
    }
    navigateTimer = setTimeout(() => {
        if (lastCreatedTabId != null || lastCreatedTabId != undefined) {
            chrome.tabs.remove(lastCreatedTabId, function() {
                if (chrome.runtime.lastError) {
                    console.error("Error removing current tab:", chrome.runtime.lastError.message);
                } else {
                    console.log("Current tab removed successfully.");
                }
            });
            const navigateMessage = new NavigateToLinksMessage();
            chrome.runtime.sendMessage(navigateMessage);
        }
    }, 10000); 
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (PopulateChatlogLinksMessage.validate(message)) {
        chatlogLinks = message.links;
        console.error("chatlog links: ", chatlogLinks)
        sendResponse({"status": "Chatlog links populated."})
    } else if (NavigateToLinksMessage.validate(message)) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0].id) {
          console.error("No tab ID found in query response.");
          return;
        }
        const originalTabId: number = tabs[0].id;
        const targetLink: string = chatlogLinks[linkCounter];
        chrome.storage.local.set({ originalTabId: originalTabId });

        if (linkCounter < chatlogLinks.length) {
            const appendedUrl: string = targetLink + NAVIGATION_MARKER + message.originalTabId;
            chrome.tabs.create({ url: appendedUrl }, (newTab) => {
                lastCreatedTabId = newTab.id;
                resetNavigationTimer();
            });
        }
        linkCounter++;
      });
    } else if (SendClipboardContentMessage.validate(message)) {
        chrome.storage.local.get(['originalTabId'], function(result) {
            const originalTabId = result.originalTabId;
            if (!originalTabId) {
                console.error("Original tab ID not found in storage:", result);
                sendResponse({status: "error"});
                return;
            }
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (!tabs[0].id) {
                    console.error("No tab ID found in current tab");
                    return;
                }
            
                const currentTabId: number = tabs[0].id;
            
                chrome.tabs.update(originalTabId, {active: true}, function() {
                    const updateMessage = new UpdateShareGptLinkListMessage({ link: message.content });
                    chrome.tabs.sendMessage(originalTabId, updateMessage, function(response) {
                        if (chrome.runtime.lastError) {
                            console.error("Error sending message to original tab:", chrome.runtime.lastError.message);
                            sendResponse({ status: "error" });
                        } else {
                            console.log("Message sent successfully to original tab.");
                            sendResponse({ status: "success" });
                        }
                        // Use the captured currentTabId to ensure the correct tab is removed
                        chrome.tabs.remove(currentTabId, function() {
                            if (chrome.runtime.lastError) {
                                console.error("Error removing current tab:", chrome.runtime.lastError.message);
                            } else {
                                console.log("Current tab removed successfully.");
                            }
                        });
                    });
                });
            });
        });
    } else if (UpdateShareGptLinkListMessage.validate(message)) {
        shareGptLinks.push(message.link);
        console.error(shareGptLinks)
        const navigateMessage = new NavigateToLinksMessage();
        chrome.runtime.sendMessage(navigateMessage);
        sendResponse({ status: "success" });
    } else {
        sendResponse({status: "error", message: "Invalid message received."});
    }
    return true; // Indicates to Chrome that sendResponse will be called asynchronously
});