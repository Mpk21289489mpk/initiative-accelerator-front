import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import Header from './Modules/header';
import Footer from './Modules/footer';

// Типизируем пропсы для ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
    };
    window.addEventListener('error', handleError as any);
    return () => window.removeEventListener('error', handleError as any);
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#d32f2f' }}>💥 Ошибка на устройстве</h1>
        <p>Приложение не смогло запуститься из-за ошибки в компоненте.</p>
        <pre style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', textAlign: 'left', maxWidth: '90%', margin: '20px auto', whiteSpace: 'pre-wrap' }}>
          {error.message}
        </pre>
        <p style={{ color: '#555', fontSize: '14px' }}>
          Это поможет понять, какой компонент ломается (скорее всего, Header или запрос к API).
        </p>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      {/* Провайдер пользователя отключён, чтобы исключить его влияние */}
      <Header />
      <div className="container" style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
        <h1 style={{ color: '#2E7D32' }}>✅ Initiative Accelerator — Работает!</h1>
        <p>Если ты видишь этот текст — React успешно отрендерен.</p>
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
