import { clearClipboard } from "./clipboard/utils";

export async function retrieveUrls() {
    await clearClipboard();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      // Ensure there is an active tab to send a message to
        if (tabs.length && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "triggerManageLinks" });
        }
    });
};