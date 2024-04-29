import { processTabUrl } from './navigation';

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
    const maxAttempts: number = 500;
    const COPY_LINK_BUTTON_NAME: string = ".btn.relative.btn-primary";


    let buttonClickAttemptCount: number = 0;
    const buttonIntervalId = setInterval(() => {
        if (buttonClickAttemptCount >= maxAttempts) {
            console.log("Max button click attempts reached, stopping retries.");
            clearInterval(buttonIntervalId);
        }

        if (clickButton(COPY_LINK_BUTTON_NAME, async () => {
            console.log("Button clicked, preparing to check clipboard");
            clearInterval(buttonIntervalId); // Stop trying to click the button once clicked

            // After clicking the button, start checking the clipboard
            let clipboardAttemptCount: number = 0;
            const clipboardIntervalId = setInterval(async () => {
                try {
                    const clipboardContent = await navigator.clipboard.readText();

                    if (clipboardContent) {

                        clearInterval(clipboardIntervalId);
                        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        //     // Only the current tab is active so the array has only one element
                        //     const currentTab = tabs[0]; 
                        //     if (currentTab.id) {
                        //         chrome.tabs.sendMessage(currentTab.id, { action: "test", clipboardContent: clipboardContent })
                        //     }
                            

                        //     if (currentTab && currentTab.url) {
                        //         const originalTabId: number = processTabUrl(currentTab.url);
                        //         // // TESTING
                        //         // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        //         //     const currentId: number | undefined = tabs[0].id;
                        //         //     if (currentId) {
                        //         //         chrome.runtime.sendMessage(currentId.toString(), { action: "test", content: clipboardContent });
                        //         //     }
                        //         // });
                        //         // // TESTING
                        //         chrome.tabs.sendMessage(originalTabId, { action: "clipboardContent", content: clipboardContent }); // Send clipboard content to background.ts of tab which initiated this navigation
                        //     }
                        // });
                        // chrome.tabs.getCurrent(tab => {
                        //     if (tab && tab.id) {
                        //         chrome.tabs.remove(tab.id) // Close the current tab
                        //     }
                        // });
                    } else {
                        console.log("Clipboard is empty, retrying...");
                    }
                } catch (err) {
                    console.error("Failed to read from clipboard:", err);
                    clearInterval(clipboardIntervalId); // Stop on error as well
                }
                if (++clipboardAttemptCount >= maxAttempts) {
                    clearInterval(clipboardIntervalId); // Ensure the loop exits if content is not found
                    console.log("Max clipboard attempts reached, stopping retries.");
                }
            }, checkInterval);
        })) {
            console.log("Button found and clicked");
        } else {
            console.log("Button not found or click failed, retrying...");
        }
        buttonClickAttemptCount++;
    }, checkInterval);
};

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