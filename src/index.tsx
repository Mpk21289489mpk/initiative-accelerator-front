import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom';

import IndexRoutes from './Pages/indexRoutes'; // мы чуть позже вынесем роуты отдельно — это снизит риск ошибки при импорте
import { GlobalUserStateContextProvider } from './Modules/User/User';
import Header from './Modules/header';
import Footer from './Modules/footer';
import SiteClosed from './Modules/SiteClosed';

// Выносим всё в один компонент, чтобы легче было ловить ошибки
function AppWrapper() {
  return (
    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
          <IndexRoutes />
        </div>
        <Footer />
      </GlobalUserStateContextProvider>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Init] Error: #root element not found in index.html');
  document.body.innerHTML = '<h1 style="color:red">Critical: #root not found</h1>';
} else {
  const root = createRoot(rootElement);
  try {
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('[Init] Critical render error:', err);
    document.body.innerHTML = `
      <h1 style="color:red">Render failed</h1>
      <pre>${err instanceof Error ? err.message : String(err)}</pre>
      <p>Check Console (F12) for details.</p>
    `;
  }
}
