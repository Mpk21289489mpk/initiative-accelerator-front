import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ApiTestPage from './ApiTestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApiTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
