import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-10j2k4ftdhhdcezz.us.auth0.com"
    clientId="RTZStqYuBz2lcwQHroAkdAwpcHRMW5az"
    authorizationParams={{
      redirect_uri: "http://localhost:5173/profile",
    }}
  >
    <React.StrictMode>
      
      <App />
    </React.StrictMode>
  </Auth0Provider>
);
