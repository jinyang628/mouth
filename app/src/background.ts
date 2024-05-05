import { PopulateChatlogLinksMessage, NavigateToLinksMessage, SendClipboardContentMessage, UpdateShareGptLinkListMessage } from "./types/messages";

export const NAVIGATION_MARKER: string = "##still-human##";

let linkCounter: number = 0;
let shareGptLinks: string[] = [];
let chatlogLinks: string[] = [];

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
            chrome.tabs.create({ url: appendedUrl });
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
        chrome.tabs.update(originalTabId, {active: true}, function(tab) {
            const updateMessage = new UpdateShareGptLinkListMessage({ link: message.content });
            chrome.tabs.sendMessage(originalTabId, updateMessage, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message to original tab:", chrome.runtime.lastError.message);
                } else {
                    console.log("Message sent successfully to original tab.");
                    sendResponse({ status: "success" });
                }
            });
        });
      });
    } else if (UpdateShareGptLinkListMessage.validate(message)) {
        shareGptLinks.push(message.link);
        console.error(shareGptLinks)
        const triggerMessage = new NavigateToLinksMessage();
        chrome.runtime.sendMessage(triggerMessage);
    }
    return true; // Indicates to Chrome that sendResponse will be called asynchronously
});