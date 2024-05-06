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


export function resetNavigationTimer(navigateTimer: any, lastCreatedTabId: number | undefined) {
    if (navigateTimer) {
        clearTimeout(navigateTimer);
    }
    navigateTimer = setTimeout(() => {
        if (lastCreatedTabId != null || lastCreatedTabId != undefined) {
            chrome.tabs.remove(lastCreatedTabId, function() {
                if (chrome.runtime.lastError) {
                    console.error("Error removing current tab:", chrome.runtime.lastError.message);
                } else {
                    console.log("Current tab removed successfully.");
                }
            });
            const navigateMessage = new NavigateToLinksMessage();
            chrome.runtime.sendMessage(navigateMessage);
        }
    }, 70000); 
}