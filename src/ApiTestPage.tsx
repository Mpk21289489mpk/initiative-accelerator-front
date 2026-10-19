import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем URL из .env
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_URL не задан в .env');
        }

        const res = await fetch(`${apiUrl}/api/hello`);
        
        if (!res.ok) {
          throw new Error(`HTTP ошибка: ${res.status}`);
        }

        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка данных с бэкенда...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{data?.message || 'Данные получены'}</h1>
      
      {data?.data && data.data.length > 0 ? (
        <ul>
          {data.data.map((item: any) => (
            <li key={item.id || Math.random()} style={{ margin: '8px 0' }}>
              <strong>{item.name}</strong> — {item.status} ({item.progress}%)
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет списка задач или структура ответа другая.</p>
      )}

      <p><small>Время ответа: {new Date(data?.time).toLocaleTimeString()}</small></p>
    </div>
  );
}
