export const NAVIGATION_MARKER: string = "##still-human##";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'triggerNavigateToLinks') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "getLink", originalTabId: tabs[0].id});
        }
      });
    } else if (message.action === "navigateToLink") {
        const appendedUrl: string = message.url + NAVIGATION_MARKER + message.originalTabId;
        chrome.tabs.create({ url: appendedUrl });
    } else if (message.action === "clipboardContent") {
      const shareGptLink: string = message.content;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "updateShareGptLinkList", link: shareGptLink});
          }
      });
    } else if (message.action === "test") {
        chrome.tabs.create({ url: "https://chat.openai.com" });
    }
});