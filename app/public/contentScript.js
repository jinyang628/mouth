const clearClipboard = async () => {
  try {
    await navigator.clipboard.writeText(''); // Writing an empty string to clear the clipboard
    console.log('Clipboard cleared successfully');
  } catch (err) {
    console.error('Failed to clear the clipboard:', err);
  }
};

window.addEventListener('load', async function () {
  // Array to store all of today's links
  let links = [];
  await clearClipboard();

  const tryClickButton = setInterval(() => {
      const shareLinkButton = document.querySelector('.btn.relative.btn-neutral.btn-small.flex.h-9.w-9.items-center.justify-center.whitespace-nowrap.rounded-lg');
      if (shareLinkButton) {
          shareLinkButton.click();
          clearInterval(tryClickButton);

          setTimeout(() => {
              const copyLinkButton = document.querySelector('.btn.relative.btn-primary');
              if (copyLinkButton) {
                  copyLinkButton.click();
                  console.log("Copy link button clicked");
                  setTimeout(() => {
                    chrome.runtime.sendMessage({ action: 'triggerReadClipboard' });
                  }, 8000); // Ensure enough time for the clipboard action to complete
              }
          }, 8000);  // Adjust this time as needed to wait for button to be ready
      }
  }, 500);
});
