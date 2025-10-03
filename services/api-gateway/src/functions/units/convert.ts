// \services\api-gateway\src\functions\units\convert.ts
// Функция конвертации единиц измерения
// Отдельный модуль для обеспечения модульности и тестируемости

/**
 * Конвертация между единицами измерения
 * @param from Исходная единица
 * @param to Целевая единица
 * @param value Значение для конвертации
 * @returns Результат конвертации
 */
export const convertUnits = async (from: string, to: string, value: number): Promise<{
  result: number
  from: string
  to: string
  formula?: string
}> => {
  // Базовая логика конвертации (в будущем будет подключена к сервисам)
  const conversions: Record<string, Record<string, number | ((value: number) => number)>> = {
    meters: { feet: 3.28084, inches: 39.3701 },
    feet: { meters: 0.3048, inches: 12 },
    kg: { lbs: 2.20462 },
    lbs: { kg: 0.453592 },
    celsius: { fahrenheit: (c: number) => c * 9/5 + 32 },
    fahrenheit: { celsius: (f: number) => (f - 32) * 5/9 }
  }

  if (from === to) {
    return { result: value, from, to }
  }

  const fromConversions = conversions[from]
  if (!fromConversions) {
    throw new Error(`Неизвестная единица измерения: ${from}`)
  }

  const conversion = fromConversions[to]
  if (!conversion) {
    throw new Error(`Неизвестная единица измерения: ${to}`)
  }

  let result: number
  if (typeof conversion === 'function') {
    result = conversion(value)
  } else {
    result = value * conversion
  }

  return {
    result: Math.round(result * 10000) / 10000, // Округление до 4 знаков
    from,
    to,
    formula: `${from} → ${to}`
  }
}
