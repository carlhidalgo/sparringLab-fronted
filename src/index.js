import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
const googleClientId = "1078657503298-94crd1s132qaav69vrnff2c0srt5s607.apps.googleusercontent.com";

root.render(
  <React.StrictMode>
    <BrowserRouter> { /* Wrap with BrowserRouter */ }
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
