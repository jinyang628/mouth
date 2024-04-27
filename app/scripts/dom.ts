const COPY_LINK_BUTTON_NAME: string = ".btn.relative.btn-primary";

export const clickButton = (selector: string, callback: () => void): boolean => {
    const button: Element | null = document.querySelector(selector);
    if (button instanceof HTMLElement) {
        button.click();
        callback();
        return true;
    }
    return false;
  };
  
  export const setupClipboardCopy = (clickButton: Function) => {
    const initialDelay = 6000; // Initial delay before clicking the button
    const retryInterval = 1000; // Interval to check the clipboard every 1 second
    const maxAttempts = 30; // Optional: Maximum number of attempts to avoid infinite loops

    setTimeout(() => {
        if (clickButton(COPY_LINK_BUTTON_NAME, async () => {
            console.log("Button clicked, preparing to check clipboard");

            let attemptCount = 0;
            const intervalId = setInterval(async () => {
                try {
                    const clipboardContent = await navigator.clipboard.readText();
                    if (clipboardContent) {
                        console.log("Clipboard content:", clipboardContent);
                        clearInterval(intervalId); // Stop checking once content is found
                        // You can handle the clipboard content here, for example:
                        // Process the content or display it somewhere
                    } else {
                        console.log("Clipboard is empty, retrying...");
                    }
                } catch (err) {
                    console.error("Failed to read from clipboard:", err);
                    clearInterval(intervalId); // Stop on error as well
                }
                if (++attemptCount >= maxAttempts) {
                    clearInterval(intervalId); // Ensure the loop exits if content is not found
                    console.log("Max attempts reached, stopping retries.");
                }
            }, retryInterval);
        })) {
            console.log("Button found and clicked");
        } else {
            console.log("Button not found or click failed");
        }
    }, initialDelay);
};