import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { WeekendProvider } from './state/WeekendContext';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeekendProvider>
      <App />
    </WeekendProvider>
  </React.StrictMode>
);
