import { clearClipboard } from '../scripts/clipboard';
import { clickButton, getAllChatlogLinks, setupClipboardCopy } from '../scripts/dom';
import { NAVIGATION_MARKER } from './background';

let chatlogLinks: string[] = [];
let linkCounter: number = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getLink') {
        if (linkCounter < chatlogLinks.length) {
            chrome.runtime.sendMessage({ action: "navigateToLink", url: chatlogLinks[linkCounter], originalTabId: request.originalTabId});
            linkCounter++;
        }
    } else if (request.action === 'updateShareGptLinkList') {
        console.error("Received link:", request.link)
        chatlogLinks.push(request.link);
        if (linkCounter < chatlogLinks.length) {
            chrome.runtime.sendMessage({ action: "navigateToLink", url: chatlogLinks[linkCounter], originalTabId: request.originalTabId});
            linkCounter++;
        }
    }
});

const manageLinks = async () => {
    const SHARE_GPT_LINK_BUTTON_CLASS: string = ".btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg"

    window.addEventListener('load', async () => {
        if (window.location.href.includes(NAVIGATION_MARKER)) {
            await clearClipboard();
            const copyShareLinkInterval = setInterval(() => {
                if (clickButton(SHARE_GPT_LINK_BUTTON_CLASS, () => setupClipboardCopy(clickButton))) {
                    clearInterval(copyShareLinkInterval);
                }
            }, 500);
        } else {
            const getAllChatlogLinksInterval = setInterval(() => {
                chatlogLinks = getAllChatlogLinks();
                if (chatlogLinks.length > 0) {
                    clearInterval(getAllChatlogLinksInterval);
                    console.log(chatlogLinks);
                }
            }, 500);
        }
    });
};

manageLinks();