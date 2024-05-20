import { resetNavigationTimer } from "../scripts/navigation";
import { PopulateChatlogLinksMessage, NavigateToLinksMessage, SendClipboardContentMessage, UpdateShareGptLinkListMessage } from "./types/messages";


export const NAVIGATION_MARKER: string = "##still-human##";

let linkCounter: number = 0;
let shareGptLinks: string[] = [];
let chatlogLinks: string[] = [];
let lastCreatedTabId: number | undefined = undefined;
let navigateTimer: number | null | undefined  = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (PopulateChatlogLinksMessage.validate(message)) {
        chatlogLinks = message.links;
        sendResponse({"status": "Chatlog links populated."})
    } else if (NavigateToLinksMessage.validate(message)) {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            console.error(tabs)
            if (!tabs[0].id) {
                console.error("No tab ID found in query response.");
                return;
            }
            const originalTabId: number = tabs[0].id;
            const targetLink: string = chatlogLinks[linkCounter];
            chrome.storage.local.set({ "originalTabId": originalTabId });
            if (linkCounter < chatlogLinks.length) {
                const appendedUrl: string = targetLink + NAVIGATION_MARKER
                chrome.tabs.create({ url: appendedUrl }, (newTab) => {
                    lastCreatedTabId = newTab.id;
                    resetNavigationTimer(
                        navigateTimer=navigateTimer, 
                        lastCreatedTabId=lastCreatedTabId
                    );
                });
                linkCounter++;
            }
        });
    } else if (SendClipboardContentMessage.validate(message)) {
        console.error("SendClipboardContentMessage", message.content)
    } else if (UpdateShareGptLinkListMessage.validate(message)) {
        // If there is a failure in trying to copy the link, message.link will be an empty string and we wont add it to the list
        console.error("ShareGPTLink", message.link)
        if (message.link) { 
            shareGptLinks.push(message.link);
            chrome.storage.local.set({ 'shareGptLinks': shareGptLinks });
        }
        const navigateMessage = new NavigateToLinksMessage();
        chrome.runtime.sendMessage(navigateMessage);
        sendResponse({ status: "success" });
    } else {
        sendResponse({status: "error", message: "Invalid message received."});
    }
    return true; // Indicates to Chrome that sendResponse will be called asynchronously
});