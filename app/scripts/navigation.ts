import { NavigateToLinksMessage } from "../src/types/messages";

export async function navigateToLinks() {
    const message = new NavigateToLinksMessage();
    const response = await chrome.runtime.sendMessage(message);
    // TODO: Deal with response (error/success) appropriately
};

export function processTabUrl(url: string): number {
    const marker = "##still-human##";
    if (url.includes(marker)) {
        const parts: string[] = url.split(marker);
        if (parts.length > 1) {
            const idPart: string  = parts[1];
            try {
                const id: number = parseInt(idPart);
                return id;
            } catch (e) {
                console.error("Failed to parse ID part:", e);
            }
        } else {
            console.log("Marker found but no ID part detected.");
        }
    } else {
        console.log("URL does not contain the marker.");
    }
    // Should never reach here
    return -1;
}