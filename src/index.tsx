import React from 'react';
import { createRoot } from 'react-dom/client';

// Импортируем только самое необходимое для теста
import { BrowserRouter } from 'react-router-dom';
import { GlobalUserStateContextProvider } from './Modules/User/User';
import Header from './Modules/header';
import Footer from './Modules/footer';

// Минимальный компонент, который точно отрендерится, если React жив
function SafeApp() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1 style={{ color: '#d95030' }}>Идёт загрузка приложения...</h1>
      <p>Если ты видишь этот текст — React работает. Ошибка дальше.</p>
      <hr />
      <BrowserRouter>
        <GlobalUserStateContextProvider>
          <Header />
          <div className='container'>
            <h2>Попытка загрузить роуты...</h2>
            {/* Здесь мы пока ничего не рендерим, чтобы не ломать сборку импортом страниц */}
          </div>
          <Footer />
        </GlobalUserStateContextProvider>
      </BrowserRouter>
    </div>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[Init] ERROR: #root element not found in index.html');
  document.body.innerHTML = '<h1 style="color:red">CRITICAL: #root not found</h1>';
} else {
  const root = createRoot(rootElement);
  try {
    root.render(
      <React.StrictMode>
        <SafeApp />
      </React.StrictMode>
    );
  } catch (err) {
    console.error('[Init] CRITICAL RENDER ERROR:', err);
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: Arial; color: #d95030; text-align: center;">
        <h1>CRITICAL RENDER FAILURE</h1>
        <pre style="text-align: left; background: #fff; padding: 20px; border: 1px solid #ccc; max-width: 800px; margin: 0 auto;">
${err instanceof Error ? err.message : String(err)}
        </pre>
        <p><strong>ВАЖНО:</strong> Открой консоль (F12 → Console) и скопируй сюда всё, что там красным.</p>
      </div>
    `;
  }
}
