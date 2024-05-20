import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
    return (
        <div className="App">
            <p>Don't let AI steal your thunder</p>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
