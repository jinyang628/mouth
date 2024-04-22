window.addEventListener('load', function () {
    console.log('Content script loaded');
    const tryClickButton = setInterval(() => {
      const button = document.querySelector('button[data-testid="share-button"]'); // Adjust this selector to the actual button
      if (button) {
        button.click();
        clearInterval(tryClickButton);
        setTimeout(() => {
          const link = document.querySelector('input[type="text"]'); // Adjust this selector to where the link appears
          if (link) {
            navigator.clipboard.writeText(link.value).then(() => {
              chrome.runtime.sendMessage({type: "notify", text: "Link copied to clipboard!"});
            });
          }
        }, 1000); // Adjust the delay as needed
      }
    }, 500);
  });
  