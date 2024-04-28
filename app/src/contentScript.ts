import { clearClipboard } from '../scripts/clipboard';
import { clickButton, getAllChatlogLinks, setupClipboardCopy } from '../scripts/dom';

const manageLinks = async () => {
    const SHARE_GPT_LINK_BUTTON_CLASS: string = ".btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg"

    window.addEventListener('load', async () => {
        let chatlogLinks: string[] = []
        const getAllChatlogLinksInterval = setInterval(() => {
            chatlogLinks = getAllChatlogLinks();
            if (chatlogLinks.length > 0) {
                clearInterval(getAllChatlogLinksInterval);
                console.log(chatlogLinks);
            }
        }, 500);

        // for (let i = 0; i < chatlogLinks.length; i++) {
        //     chrome.runtime.sendMessage({ action: "navigate", url: chatlogLinks[i] });
        // }
        
        await clearClipboard();
        const copyShareLinkInterval = setInterval(() => {
            if (clickButton(SHARE_GPT_LINK_BUTTON_CLASS, () => setupClipboardCopy(clickButton))) {
                clearInterval(copyShareLinkInterval);
            }
        }, 500);
    });
};

manageLinks();