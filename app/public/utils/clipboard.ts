export const clearClipboard = async () => {
    try {
        await navigator.clipboard.writeText('');
        console.log('Clipboard cleared successfully');
    } catch (err) {
        console.error('Failed to clear the clipboard:', err);
    }
};
  