import React from 'react';
import { clearClipboard, readFromClipboard } from './utils';

const ClipboardManager = () => {
    return (
        <>
            <button onClick={clearClipboard}>Clear Clipboard</button>
            <button onClick={readFromClipboard}>Read From Clipboard</button>
        </>
    );
};

export default ClipboardManager;
