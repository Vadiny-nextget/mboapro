import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './styles/tailwind.css';
import './styles/main.scss';

import { router } from './router';
import ThemeProvider from './providers/ThemeProvider';
import I18nProvider from './providers/I18nProvider';
import AppErrorBoundary from './providers/AppErrorBoundary';
import GlobalSuspenseFallback from './components/shared/GlobalSuspenseFallback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <Suspense fallback={<GlobalSuspenseFallback />}>
        <ThemeProvider>
          <I18nProvider>
            <RouterProvider router={router} />
          </I18nProvider>
        </ThemeProvider>
      </Suspense>
    </AppErrorBoundary>
  </StrictMode>
);