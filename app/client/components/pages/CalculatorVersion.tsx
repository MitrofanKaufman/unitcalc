import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CalculatorVersion = () => {
  const { id, version } = useParams<{ id: string; version: string }>();
  interface CalculatorResult {
    version: string;
    result: number | string;
    [key: string]: unknown;
  }

  const [calc, setCalc] = useState<CalculatorResult | null>(null);

  useEffect(() => {
    fetch(`/api/calculator/${id}/${version}`)
      .then(res => res.json())
      .then(data => setCalc(data));
  }, [id, version]);

  if (!calc) return <div>Loading...</div>;

  return (
    <div>
      <h1>Расчёт #{calc.version}</h1>
      {/* Вывод деталей расчёта */}
      <p>Результат: {calc.result}</p>
    </div>
  );
};
export default CalculatorVersion;
