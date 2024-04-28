import { clearClipboard } from '../scripts/clipboard';
import { clickButton, setupClipboardCopy } from '../scripts/dom';

const SHARE_GPT_LINK_BUTTON_NAME: string = ".btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg"

const manageLinks = async () => {
    window.addEventListener('load', async () => {
      await clearClipboard();
      const intervalId = setInterval(() => {
          if (clickButton(SHARE_GPT_LINK_BUTTON_NAME, () => setupClipboardCopy(clickButton))) {
              clearInterval(intervalId);
          }
      }, 500);
    });
};

manageLinks();