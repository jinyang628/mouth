const COPY_LINK_BUTTON_NAME: string = ".btn.relative.btn-primary";

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
                        console.log("Clipboard content:", clipboardContent);
                        clearInterval(clipboardIntervalId); // Stop checking once content is found
                        // You can handle the clipboard content here
                        // TODO: Pass to stomach
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

export function getAllChatlogLinks() {
    const CHAT_LOG_CONTAINER_CLASS: string = 'relative mt-5 empty:mt-0 empty:hidden';
    const INDIVIDUAL_CHAT_URL_CLASS: string = 'flex items-center gap-2 p-2';
    const CHATGPT_URL_PREFIX: string = 'https://chat.openai.com';   

    const chatlogContainers: HTMLCollectionOf<Element> = document.getElementsByClassName(CHAT_LOG_CONTAINER_CLASS);
    const todayContainer: Element = chatlogContainers[0];
    const ol: HTMLOListElement | null = todayContainer.getElementsByTagName('ol')[0]; // There is only one ordered list in each container
    if (!ol) {
        console.error("Failed to retrieve ordered list element");
    }
    // Iterate over all children (<li> elements) of the ordered list
    for (let j = 0; j < ol.children.length; j++) {
        const listItem: Element = ol.children[j];
        const hrefElement: HTMLAnchorElement | null = listItem.getElementsByClassName(INDIVIDUAL_CHAT_URL_CLASS)[0] as HTMLAnchorElement;
        if (!hrefElement) {
            console.error("Failed to retrieve href element");
        }
        const href: string | null = hrefElement.getAttribute("href");
        if (!href) {
            console.error("Failed to retrieve href attribute from element");
        }
        const link: string = `${CHATGPT_URL_PREFIX}${href}`;
        console.log(link);
    }
}