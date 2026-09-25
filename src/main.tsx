import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import App from './App';

// The loaded-page navigation hook restores history positions after lazy routes mount.
history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
