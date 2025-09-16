import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CalculatorLatest = () => {
  const { id } = useParams<{ id: string }>();
  const [calc, setCalc] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/calculator/${id}/latest`)
      .then(res => res.json())
      .then(data => setCalc(data));
  }, [id]);

  if (!calc) return <div>Loading...</div>;

  const handleDelete = async () => {
    await fetch(`/api/calculator/${id}/delete`, { method: 'DELETE' });
    // После удаления можно обновить страницу или перенаправить
    navigate(`/calculator/${id}/latest`);
  };

  const handleDownload = async () => {
    // Получаем PDF с сервера
    const response = await axios.get(`/api/calculator/${id}/pdf`, { responseType: 'blob' }); // responseType 'blob' для бинарного PDF:contentReference[oaicite:13]{index=13}
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `calc_${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Последний расчёт (версия {calc.version})</h1>
      {/* Вывод деталей расчёта */}
      <p>Результат: {calc.result}</p>
      {/* Кнопки действий */}
      <button onClick={handleDelete}>Удалить последний</button>
      <button onClick={handleDownload}>Скачать PDF</button>
    </div>
  );
};
export default CalculatorLatest;
