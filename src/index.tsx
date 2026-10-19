import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { GlobalUserStateContextProvider } from './Modules/User/User';
import Header from './Modules/header';
import Footer from './Modules/footer';

function App() {
  console.log('🚀 App: Начало рендера компонента App'); // <--- ЛОГ 1
  
  return (
    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className="container">
          <h1 style={{ color: '#2196F3', padding: '20px' }}>
            Initiative Accelerator — Загрузка...
          </h1>
        </div>
        <Footer />
      </GlobalUserStateContextProvider>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[Init] ERROR: #root element not found in index.html');
  document.body.innerHTML = '<h1 style="color:red">CRITICAL: #root not found</h1>';
} else {
  const root = createRoot(rootElement);
  console.log('🚀 Init: Подготовка к рендеру через createRoot'); // <--- ЛОГ 2
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ Init: root.render() успешно вызван'); // <--- ЛОГ 3
  } catch (err) {
    console.error('[Init] CRITICAL RENDER ERROR:', err);
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: Arial; color: #d95030; text-align: center;">
        <h1>CRITICAL RENDER FAILURE</h1>
        <pre>\${err instanceof Error ? err.message : String(err)}</pre>
        <p>Check Console (F12) for details.</p>
      </div>
    `;
  }
}
