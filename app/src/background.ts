import { SendClipboardContentMessage } from "./types/messages";
import { fetchConfig } from "../scripts/config";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {

    if (SendClipboardContentMessage.validate(message)) {
        const shareGptLink: string = message.content;
        if (!shareGptLink) {
            console.error("No content found in clipboard");
            return;
        }
        const config = await fetchConfig();
        if (!config) {
            console.error('Config not found');
            return;
        }
        console.log("Sending POST request to stomach with link:", shareGptLink);
        console.log("Config:", config);
        fetch(`${config.STOMACH_API_URL}/api/entry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: config.API_KEY,
                url: shareGptLink,
                tasks: ["summarise"]
            })
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.error('Error making POST request:', error);
        });
    } 
});