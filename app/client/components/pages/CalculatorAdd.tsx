import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CalculatorAdd = () => {
  const { id } = useParams<{ id: string }>();
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/calculator/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: inputValue })
    });
    // Переход к последнему расчёту после сохранения
    navigate(`/calculator/${id}/latest`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Введите данные расчёта"
      />
      <button type="submit">Сохранить</button>
    </form>
  );
};
export default CalculatorAdd;
