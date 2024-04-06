import { NorthStarThemeProvider } from '@aws-northstar/ui';
import { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Auth from './components/Auth';
import RuntimeContextProvider from './context/RuntimeContext';
import { ApiProvider } from './hooks/useApi';
import App from './layouts/App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NorthStarThemeProvider>
      <BrowserRouter>
        <RuntimeContextProvider>
          <Auth>
            <ApiProvider queryClient={queryClient}>
              <App />
            </ApiProvider>
          </Auth>
        </RuntimeContextProvider>
      </BrowserRouter>
    </NorthStarThemeProvider>
  </React.StrictMode>,
);
