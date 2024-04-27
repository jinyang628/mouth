// Utilities for interacting with the page
const pageUtils = {
  clearClipboard: async () => {
    try {
      await navigator.clipboard.writeText(''); // Writing an empty string to clear the clipboard
      console.log('Clipboard cleared successfully');
    } catch (err) {
      console.error('Failed to clear the clipboard:', err);
    }
  },

  clickButtonWhenAvailable: (selector: string, callback: () => void): void => {
    const observer = new MutationObserver((mutations, obs) => {
      const button: Element | null = document.querySelector(selector);
      if (button instanceof HTMLElement) {
        button.click();
        console.log(`${selector} button clicked`);
        callback();
        obs.disconnect(); // Stop observing after the button has been clicked
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  setupClipboardCopy: () => {
    pageUtils.clickButtonWhenAvailable('.btn.relative.btn-primary', () => {
      console.log("Button found and clicked, now triggering clipboard read");
      chrome.runtime.sendMessage({ action: 'triggerReadClipboard' });
    });
  }
}


// Main functionality to execute on page load
const manageLinks = () => {
  let links: string[] = []; // Store links here

  window.addEventListener('load', async () => {
    await pageUtils.clearClipboard();
    pageUtils.clickButtonWhenAvailable('.btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg', pageUtils.setupClipboardCopy);
  });
};

manageLinks();