import { clearClipboard } from '../scripts/clipboard';
import { clickButton, getAllChatlogLinks, setupClipboardCopy } from '../scripts/dom';
import { NAVIGATION_MARKER } from './background';
import { PopulateChatlogLinksMessage, populateChatlogLinksMessageSchema } from './types/messages';

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
                const chatlogLinks: string[] = getAllChatlogLinks();
                if (chatlogLinks.length > 0) {
                    clearInterval(getAllChatlogLinksInterval);
                    console.error(chatlogLinks);
                    // const message: PopulateChatlogLinksMessage  = populateChatlogLinksMessageSchema.parse({
                    //     action: 'populateChatlogLinks',
                    //     links: chatlogLinks
                    // }); 
                    const message = {
                        action: 'populateChatlogLinks',
                        links: chatlogLinks
                    }
                    console.error(message);
                    chrome.runtime.sendMessage(message)
                }
            }, 500);
        }
    });
};

manageLinks();