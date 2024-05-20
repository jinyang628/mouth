import { start } from '../scripts/dom';

window.addEventListener('load', async () => {    
    // Example: Add a new button to the UI
    const stillHumanButton = document.createElement('button');
    stillHumanButton.style.position = "fixed";
    stillHumanButton.style.top = "12px";
    stillHumanButton.style.right = "122px";
    stillHumanButton.style.width = "32px"; 
    stillHumanButton.style.height = "32px";
    // Use chrome.runtime.getURL to get the correct path
    const imagePath = chrome.runtime.getURL('icons/main.png');
    stillHumanButton.style.backgroundImage = `url('${imagePath}')`;
    stillHumanButton.style.backgroundSize = "cover";
    document.body.appendChild(stillHumanButton);

    stillHumanButton.addEventListener('click', async () => {
        await start();
    });
});
  

