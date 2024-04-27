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
    const maxAttempts: number = 100;

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
