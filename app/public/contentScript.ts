import { clickButton, setupClipboardCopy } from './utils/dom';

const SHARE_GPT_LINK_BUTTON_NAME: string = ".btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg"

const manageLinks = async () => {
    const intervalId = setInterval(() => {
        if (clickButton(SHARE_GPT_LINK_BUTTON_NAME, () => setupClipboardCopy(clickButton))) {
            clearInterval(intervalId);
        }
    }, 500);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "triggerManageLinks") {
        manageLinks();
    }
});