import React from 'react';
import { createRoot } from 'react-dom/client';
import './normalize.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
// Импорт оставляем, но использовать не будем (пока)
import { GlobalUserStateContextProvider } from './Modules/User/User'; 
import Header from './Modules/header';
import Footer from './Modules/footer';

function App() {
  // Лог в консоль, чтобы видеть в F12, что App отрисовался
  console.log('🚀 App: Компонент App успешно отрендерен!');

  return (
    <BrowserRouter>
      {/* 
        ⚠️ ВРЕМЕННО ОТКЛЮЧЕНО: 
        Мы закомментировали провайдер, чтобы проверить, не он ли держит приложение в состоянии "Загрузка".
        Если после деплоя страница откроется — проблема точно внутри GlobalUserStateContextProvider.
      */}
      {/* <GlobalUserStateContextProvider> */}
        <Header />
        <div className="container" style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
          <h1 style={{ color: '#2E7D32', marginBottom: '20px' }}>
            ✅ Initiative Accelerator — РАБОТАЕТ! 🎉
          </h1>
          <p style={{ color: '#555', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Экран загрузки исчез! Это значит, что проблема была в компоненте проверки пользователя 
            (<code>GlobalUserStateContextProvider</code>). Теперь мы можем спокойно чинить его логику.
          </p>
          <div style={{ marginTop: '30px', padding: '15px', background: '#FFE0B2', borderRadius: '8px', display: 'inline-block' }}>
            <strong>Что делать дальше:</strong><br/>
            1. Сделай коммит и пуш.<br/>
            2. Дождись деплоя на Vercel.<br/>
            3. Обнови страницу и убедись, что видишь этот текст.<br/>
            4. Напиши мне: "Работает!", и мы пойдём править файл User.tsx.
          </div>
        </div>
        <Footer />
      {/* </GlobalUserStateContextProvider> */}
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[Init] ERROR: #root element not found in index.html');
  document.body.innerHTML = '<h1 style="color:red">CRITICAL: #root not found</h1>';
} else {
  const root = createRoot(rootElement);
  
  // Дополнительный лог инициализации
  console.log('🚀 Init: Подготовка к рендеру через createRoot');

  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ Init: root.render() успешно вызван');
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

