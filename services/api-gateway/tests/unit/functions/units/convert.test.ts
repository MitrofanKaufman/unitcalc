// \services\api-gateway\tests\unit\functions\units\convert.test.ts
// Unit тесты для функции конвертации единиц
// Тестирование бизнес-логики отдельной функции

import { convertUnits } from '../../../../src/functions/units/convert'

describe('convertUnits', () => {
  it('должен корректно конвертировать метры в футы', async () => {
    const result = await convertUnits('meters', 'feet', 100)

    expect(result).toEqual({
      result: 328.084,
      from: 'meters',
      to: 'feet',
      formula: 'meters → feet'
    })
  })

  it('должен корректно конвертировать футы в метры', async () => {
    const result = await convertUnits('feet', 'meters', 328.084)

    expect(result.result).toBeCloseTo(100, 3)
    expect(result.from).toBe('feet')
    expect(result.to).toBe('meters')
  })

  it('должен корректно конвертировать кг в фунты', async () => {
    const result = await convertUnits('kg', 'lbs', 50)

    expect(result.result).toBeCloseTo(110.231, 3)
    expect(result.from).toBe('kg')
    expect(result.to).toBe('lbs')
  })

  it('должен обрабатывать одинаковые единицы', async () => {
    const result = await convertUnits('meters', 'meters', 100)

    expect(result.result).toBe(100)
    expect(result.from).toBe('meters')
    expect(result.to).toBe('meters')
  })

  it('должен выбрасывать ошибку для неизвестной единицы', async () => {
    await expect(convertUnits('invalid', 'meters', 100))
      .rejects.toThrow('Неизвестная единица измерения: invalid')
  })
})
