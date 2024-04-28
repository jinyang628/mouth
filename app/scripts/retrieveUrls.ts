export async function retrieveUrls() {
    const response = await chrome.runtime.sendMessage({action: "triggerManageLinks"});
};