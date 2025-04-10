import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Workbox, WorkboxLifecycleEvent } from 'workbox-window';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

// Register service worker
if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.ts');
  
  wb.addEventListener('installed', (event: WorkboxLifecycleEvent) => {
    if (event.isUpdate) {
      if (confirm('New content is available! Click OK to refresh.')) {
        window.location.reload();
      }
    }
  });

  wb.register().catch((error: Error) => {
    console.error('Service worker registration failed:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
); 