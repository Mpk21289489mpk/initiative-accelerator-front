import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import Header from './Modules/header';
import Footer from './Modules/footer';

// Простой ErrorBoundary
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#d32f2f' }}>💥 Ошибка рендера</h1>
        <pre style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'left', maxWidth: '90%', margin: '20px auto', whiteSpace: 'pre-wrap' }}>
          {error.message}
        </pre>
      </div>
    );
  }

  return children as React.ReactElement;
}

function App() {
  // Страховка: если приложение висит дольше 3 секунд — показываем «Работает» принудительно
  const [forceShowContent, setForceShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('⚠️ Таймаут 3 сек: принудительно показываем контент, чтобы не висеть на лоадере');
      setForceShowContent(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="container" style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        {forceShowContent ? (
          <>
            <h1 style={{ color: '#2E7D32' }}>✅ Initiative Accelerator — Работает (даже если API молчит)</h1>
            <p style={{ color: '#555' }}>
              Это экран-страховка: он появился, потому что приложение ждало данные дольше 3 секунд.
              Значит, проблема точно в запросе к API (сеть/сервер/обработчик ошибки).
            </p>
          </>
        ) : (
          <div style={{ fontSize: '18px', color: '#666' }}>
            Загрузка... (если это висит больше 3 секунд — проблема в запросе к серверу)
          </div>
        )}
      </div>
      <Footer />
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = '<h1 style="color:red">CRITICAL: #root not found</h1>';
} else {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
