import { Message, PopulateChatlogLinksMessage, messageSchema, populateChatlogLinksMessageSchema } from "./types/messages";

export const NAVIGATION_MARKER: string = "##still-human##";

let linkCounter: number = 0;
let shareGptLinks: string[] = [];
let chatlogLinks: string[] = [];


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // const parsedMessage: Message = messageSchema.parse(message); 
    // if (parsedMessage.action === "populateChatlogLinks") {
        // const { links } = parsedMessage
    if (message.action === "populateChatlogLinks") {
        chatlogLinks = message.links;
        sendResponse({"status": "Chatlog links populated."})
    } else if (message.action === "triggerNavigateToLinks") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0].id) {
          console.error("No tab ID found in query response.");
          return;
        }
        const originalTabId: number = tabs[0].id;
        const targetLink: string = chatlogLinks[linkCounter];
        chrome.storage.local.set({ originalTabId: originalTabId });
        console.error("target links: ", targetLink)

        if (linkCounter < chatlogLinks.length) {
            const appendedUrl: string = targetLink + NAVIGATION_MARKER + message.originalTabId;
            chrome.tabs.create({ url: appendedUrl });
        }
        linkCounter++;
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
    } else if (message.action === "updateShareGptLinkList") {
        shareGptLinks.push(message.link);
        console.error(shareGptLinks)
        chrome.runtime.sendMessage({ action: "triggerNavigateToLinks" });
    }
    return true; // Indicates to Chrome that sendResponse will be called asynchronously
});