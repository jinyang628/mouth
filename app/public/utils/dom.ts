export const clickButton = (selector: string, callback: () => void): boolean => {
    const button: Element | null = document.querySelector(selector);
    if (button instanceof HTMLElement) {
        button.click();
        console.log(`${selector} button clicked`);
        callback();
        return true;
    }
    return false;
  };
  
export const setupClipboardCopy = (clickButton: Function) => {
    const delay = 8000; // Delay to ensure button visibility and clipboard actions
    setTimeout(() => {
        if (clickButton('.btn.relative.btn-primary', () => console.log("Button clicked, preparing clipboard"))) {
            setTimeout(() => {
                chrome.runtime.sendMessage({ action: 'triggerReadClipboard' });
            }, delay);
        }
    }, delay);
};
  