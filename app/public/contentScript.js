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

  clickButton: (selector) => {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
      console.log(`${selector} button clicked`);
      return true;
    }
    return false;
  },

  setupClipboardCopy: () => {
    const delay = 8000; // Delay to ensure button visibility and clipboard actions
    setTimeout(() => {
      if (pageUtils.clickButton('.btn.relative.btn-primary')) {
        setTimeout(() => {
          chrome.runtime.sendMessage({ action: 'triggerReadClipboard' });
        }, delay);
      }
    }, delay);
  }
}


// Main functionality to execute on page load
const manageLinks = () => {
  let links = []; // Store links here

  window.addEventListener('load', async () => {
    await pageUtils.clearClipboard();
    const intervalId = setInterval(() => {
      if (pageUtils.clickButton('.btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg')) {
        clearInterval(intervalId);
        pageUtils.setupClipboardCopy();
      }
    }, 500);
  });
};

manageLinks();