import { clearClipboard } from './utils/clipboard';
import { clickButton, setupClipboardCopy } from './utils/dom';

const manageLinks = async () => {
    await clearClipboard();
    const intervalId = setInterval(() => {
        if (clickButton('.btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg', () => setupClipboardCopy(clickButton))) {
            clearInterval(intervalId);
        }
    }, 500);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "triggerManageLinks") {
        manageLinks();
    }
});