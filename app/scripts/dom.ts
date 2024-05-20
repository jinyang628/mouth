import { SendClipboardContentMessage } from '../src/types/messages';
import { clearClipboard } from './clipboard';

export const CHATGPT_URL_PREFIX: string = 'https://chat.openai.com'; 

export async function start() {
    const SHARE_GPT_LINK_BUTTON_CLASS: string = "h-10 rounded-lg px-2.5 text-token-text-secondary focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary"
    await clearClipboard();
    const copyShareLinkInterval = setInterval(() => {
        if (clickButton(SHARE_GPT_LINK_BUTTON_CLASS, () => setupClipboardCopy(clickButton))) {
            clearInterval(copyShareLinkInterval);
        }
    }, 500);
}

export function clickButton(className: string, callback: () => void): boolean {
    const button: Element = document.getElementsByClassName(className)[0];
    if (button instanceof HTMLElement) {
        button.click();
        callback();
        return true;
    }
    return false;
};
  
export function setupClipboardCopy(clickButton: Function) {
    const checkInterval: number = 1000;
    const maxAttempts: number = 3;
    const COPY_LINK_BUTTON_NAME: string = "btn relative btn-primary ml-4 mr-0 mt-0 rounded-xl px-4 py-3 text-base font-bold";
    const CLOSE_COPY_LINK_POPUP_BUTTON_NAME: string = "text-token-text-tertiary hover:text-token-text-secondary";

    let buttonClickAttemptCount: number = 0;
    let clipboardAttemptCount: number = 0;

    const attemptClipboardCopy = () => {
        if (buttonClickAttemptCount >= maxAttempts) {
            const message = new SendClipboardContentMessage({ content: "" });
            chrome.runtime.sendMessage(message, function(response) {
                if (response.status === "success") {
                    console.log("Clipboard content sent successfully");
                } else {
                    console.error("Failed to send clipboard content:");
                }
            });
            return; // Exit the function if max attempts are reached.
        }

        // Attempt to click the copy button and read clipboard.
        if (clickButton(COPY_LINK_BUTTON_NAME, async () => {
            console.log("Button clicked, preparing to check clipboard");

            const clipboardIntervalId = setInterval(async () => {
                try {
                    const clipboardContent = await navigator.clipboard.readText();
                    if (clipboardContent) {
                        clearInterval(clipboardIntervalId);
                        if (clickButton(CLOSE_COPY_LINK_POPUP_BUTTON_NAME, () => {
                            const message = new SendClipboardContentMessage({ content: clipboardContent });
                            chrome.runtime.sendMessage(message, function(response) {
                                if (response.status === "success") {
                                    console.log("Clipboard content sent successfully");
                                } else {
                                    console.error("Failed to send clipboard content:");
                                }
                            });
                        })) {
                            console.log("Close button found and clicked");
                        } else {
                            console.error("Close button not found or click failed");
                        }
                    } else {
                        console.log("Clipboard is empty, retrying...");
                        buttonClickAttemptCount++;
                        setTimeout(() => {
                            clearInterval(clipboardIntervalId); // Clear the current interval
                            attemptClipboardCopy(); // Reclick the button and recheck clipboard
                        }, checkInterval);
                    }
                } catch (err) {
                    if (err instanceof DOMException && err.name === 'NotAllowedError') {
                        console.log("Clipboard read failed due to focus, retrying...");
                        // Try clicking the button again
                        buttonClickAttemptCount++;
                        setTimeout(attemptClipboardCopy, checkInterval); // Schedule another button click
                    } else {
                        console.error("Failed to read from clipboard:", err);
                        clearInterval(clipboardIntervalId);
                        return; 
                    }
                }
                if (++clipboardAttemptCount >= maxAttempts) {
                    clearInterval(clipboardIntervalId);
                    console.log("Max clipboard attempts reached, stopping clipboard retries.");
                }
            }, checkInterval);
        })) {
            console.log("Button found and clicked");
        } else {
            console.log("Button not found or click failed, retrying...");
            buttonClickAttemptCount++;
            setTimeout(attemptClipboardCopy, checkInterval); // Schedule another button click attempt
        }
    };

    attemptClipboardCopy();
}


export function getAllChatlogLinks(): string[] {
    const links: string[] = [];

    const CHAT_LOG_CONTAINER_CLASS: string = 'relative mt-5 empty:mt-0 empty:hidden';
    const INDIVIDUAL_CHAT_URL_CLASS: string = 'flex items-center gap-2 p-2';

    const chatlogContainers: HTMLCollectionOf<Element> = document.getElementsByClassName(CHAT_LOG_CONTAINER_CLASS);
    const todayContainer: Element | null = chatlogContainers[0];
    if (!todayContainer) {
        console.error("Failed to retrieve today container");
        return links;
    }
     // There is only one ordered list in each container
    const ol: HTMLOListElement | null = todayContainer.getElementsByTagName('ol')[0];
    if (!ol) {
        console.error("Failed to retrieve ordered list element");
        return links;
    }
    // Iterate over all children (<li> elements) of the ordered list
    for (let j = 0; j < ol.children.length; j++) {
        const listItem: Element = ol.children[j];
        const hrefElement: HTMLAnchorElement | null = listItem.getElementsByClassName(INDIVIDUAL_CHAT_URL_CLASS)[0] as HTMLAnchorElement;
        if (!hrefElement) {
            console.error("Failed to retrieve href element");
            return links;
        }
        const href: string | null = hrefElement.getAttribute("href");
        if (!href) {
            console.error("Failed to retrieve href attribute from element");
            return links;
        }
        const link: string = `${CHATGPT_URL_PREFIX}${href}`;
        links.push(link);
    }
    return links;
}