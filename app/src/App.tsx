import React, { useState, useEffect } from 'react';
import { navigateToLinks } from '../scripts/navigation';

const App = () => {
    const [urls, setUrls] = useState<string[]>([]);

    useEffect(() => {
        const handleMessage = (message: any, sender: any, sendResponse: any) => {
            if (message.type === 'allLinksNavigated') {
                console.log("Received URLs:", message.shareGptLinks)
                setUrls(message.shareGptLinks);
                sendResponse({status: "Received URLs"});
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    return (
        <div className="App">
            <button onClick={navigateToLinks}>Navigate to Links</button>
            <ul>
                {urls.map((url, index) => (
                    <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                ))}
            </ul>
        </div>
    );
};

export default App;
