import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { navigateToLinks } from '../../scripts/navigation';
import { post } from '../../scripts/api/entry/_post';
import { useConfig } from '../utils';
import { Task } from '../types/tasks';

function App() {
    const [urls, setUrls] = useState<string[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [summariseChecked, setSummariseChecked] = useState<boolean>(false);
    const [practiceChecked, setPracticeChecked] = useState<boolean>(false);
    const config = useConfig();

    useEffect(() => {
        async function fetchData() {
          const result = await chrome.storage.local.get(['shareGptLinks', 'apiKey']);
          if (result.apiKey) {      
            if (result.shareGptLinks && result.shareGptLinks.length > 0) {
              console.log("Retrieved URLs from storage:", result.shareGptLinks);
              setUrls(result.shareGptLinks);
              if (config && config.STOMACH_API_URL) {
                try {
                    post({ STOMACH_API_URL: config.STOMACH_API_URL, API_KEY: result.apiKey, shareGptLinks: result.shareGptLinks, tasks: tasks});
                } catch (error) {
                    console.error('Error making POST request:', error);
                } finally {
                    chrome.storage.local.remove(['shareGptLinks']);
                }
              }
            } else {
              console.log("No URLs found, retrying...");
              setTimeout(fetchData, 1000); // Retry after 1 second
            }
          } else {
            alert("API Key is invalid or not set.")
          }
        }
        if (config) {
          fetchData();
        }
    }, [config]); // Depend on config as apiKey is checked inside fetchData now
      
    useEffect(() => {
        const selectedTasks = [];
        if (summariseChecked) selectedTasks.push(Task.SUMMARISE);
        if (practiceChecked) selectedTasks.push(Task.PRACTICE);
        setTasks(selectedTasks);
    }, [summariseChecked, practiceChecked]);

    return (
        <div className="App">
            <button onClick={navigateToLinks}>Navigate to Links</button>
            <ul>
                {urls.map((url, index) => (
                    <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                    </li>
                ))}
            </ul>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={summariseChecked}
                        onChange={(e) => setSummariseChecked(e.target.checked)}
                    /> Summarise
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={practiceChecked}
                        onChange={(e) => setPracticeChecked(e.target.checked)}
                    /> Practice
                </label>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);