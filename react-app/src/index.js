import React from 'react'; 
import App from './App';
import { createRoot } from 'react-dom/client';
import './assets/css/styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);