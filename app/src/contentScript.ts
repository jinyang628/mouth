import { clearClipboard } from '../scripts/clipboard';
import { clickButton, getAllChatlogLinks, setupClipboardCopy } from '../scripts/dom';

const SHARE_GPT_LINK_BUTTON_CLASS: string = ".btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg"



const manageLinks = async () => {
    window.addEventListener('load', async () => {
        setTimeout(() => {
            getAllChatlogLinks();
        }, 4000);
        
        await clearClipboard();
        const intervalId = setInterval(() => {
            if (clickButton(SHARE_GPT_LINK_BUTTON_CLASS, () => setupClipboardCopy(clickButton))) {
                clearInterval(intervalId);
            }
        }, 500);
    });
};

manageLinks();