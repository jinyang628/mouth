import { SendClipboardContentMessage } from '../src/types/messages';

export const CHATGPT_URL_PREFIX: string = 'https://chat.openai.com'; 

export function clickButton(selector: string, callback: () => void): boolean {
    const button: Element | null = document.querySelector(selector);
    if (button instanceof HTMLElement) {
        button.click();
        callback();
        return true;
    }
    return false;
};
  
export function setupClipboardCopy(clickButton: Function) {
    const checkInterval: number = 1000;
    const maxAttempts: number = 7;
    const COPY_LINK_BUTTON_NAME: string = ".btn.relative.btn-primary";

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
                        const message = new SendClipboardContentMessage({ content: clipboardContent });
                        chrome.runtime.sendMessage(message, function(response) {
                            if (response.status === "success") {
                                console.log("Clipboard content sent successfully");
                            } else {
                                console.error("Failed to send clipboard content:");
                            }
                        });
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