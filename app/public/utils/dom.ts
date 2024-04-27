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
    const delay = 8000; // Delay to ensure button visibility and clipboard actions
    setTimeout(() => {
        if (clickButton(COPY_LINK_BUTTON_NAME, () => console.log("Button clicked, preparing clipboard"))) {
            setTimeout(() => {
                chrome.runtime.sendMessage({ action: 'triggerReadClipboard' });
            }, delay);
        }
    }, delay);
};
  