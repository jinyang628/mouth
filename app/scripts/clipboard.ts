export async function clearClipboard() {
    try {
        await navigator.clipboard.writeText('');
        console.log('Clipboard cleared successfully');
    } catch (err) {
        console.error('Failed to clear the clipboard:', err);
    }
};
  

export async function readFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        console.log('Clipboard content:', text);
        return text;
    } catch (error) {
        console.error('Failed to read from clipboard:', error);
        throw error; // to handle it in the message response
    }
};