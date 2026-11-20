import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/bricolage-grotesque';
import './styles/storefront.css';
import './styles/commerce.css';
import App from './App.jsx';

const Router = import.meta.env.VITE_HASH_ROUTING === 'true' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router><App /></Router>
  </StrictMode>,
);
