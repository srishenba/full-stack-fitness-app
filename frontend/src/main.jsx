import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import ApiConfigurator from './components/ApiConfigurator';
import App from './App.jsx';
import './index.css';

// Service Worker Registration for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js').then((registration) => {
      console.log('SW: Firebase Messaging Service Worker registered successfully:', registration.scope);
    }).catch((error) => {
      console.error('SW: Firebase Messaging Service Worker registration failed:', error);
    });
  });
}

// "Add to Home Screen" Install Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('SW: Install prompt ready');
  
  // Automatically suggest installation after a brief 2-second delay on page load
  setTimeout(() => {
    if (deferredPrompt) {
      if (window.confirm("Install Meal Move app for a better experience")) {
        window.showInstallPrompt();
      }
    }
  }, 2000);

  window.dispatchEvent(new CustomEvent('pwa-install-ready'));
});

// Expose a global function to trigger the prompt
window.showInstallPrompt = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the installation');
      } else {
        console.log('User dismissed the installation');
      }
      deferredPrompt = null;
    });
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LoadingProvider>
        <AuthProvider>
          <ApiConfigurator />
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#f1f5f9',
                border: '1px solid rgba(20, 184, 166, 0.2)',
              },
            }}
          />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
