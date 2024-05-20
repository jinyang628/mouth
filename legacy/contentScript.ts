// const manageLinks = async () => {
//     const SHARE_GPT_LINK_BUTTON_CLASS: string = "h-10 rounded-lg px-2.5 text-token-text-secondary focus-visible:outline-0 hover:bg-token-main-surface-secondary focus-visible:bg-token-main-surface-secondary"

//     window.addEventListener('load', async () => {
//         if (window.location.href.includes(NAVIGATION_MARKER)) {
//             await clearClipboard();
//             const copyShareLinkInterval = setInterval(() => {
//                 if (clickButton(SHARE_GPT_LINK_BUTTON_CLASS, () => setupClipboardCopy(clickButton))) {
//                     clearInterval(copyShareLinkInterval);
//                 }
//             }, 500);
//         } else {
//             const getAllChatlogLinksInterval = setInterval(() => {
//                 const chatlogLinks: string[] = getAllChatlogLinks();
//                 if (chatlogLinks.length > 0) {
//                     clearInterval(getAllChatlogLinksInterval);
//                     const message = new PopulateChatlogLinksMessage({ links: chatlogLinks });
//                     console.error("Today's links: ", chatlogLinks)
//                     chrome.runtime.sendMessage(message)
//                 }
//             }, 500);
//         }
//     });
// };

// manageLinks();