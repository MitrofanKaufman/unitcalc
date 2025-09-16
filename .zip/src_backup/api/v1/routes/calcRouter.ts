import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

// Определение типов для параметров запроса
interface ParamsDictionary {
  [key: string]: string;
}

/**
 * Роутер для работы с калькулятором
 * Обрабатывает сохранение и получение версий расчетов
 */
const router = express.Router();
const CALC_DIR = path.resolve('public/calculator');

/**
 * Получает последнюю версию расчета по ID
 * @param id - Идентификатор расчета
 * @returns Номер последней версии или 0, если расчетов нет
 */
async function getLatestVersion(id: string): Promise<number> {
  try {
    const files = await fs.readdir(CALC_DIR);
    const versions = files
      .filter(f => f.startsWith(`${id}_`) && f.endsWith('.json'))
      .map(f => parseInt(f.slice(id.length + 1, -5), 10))
      .filter(v => !isNaN(v));
    return versions.length ? Math.max(...versions) : 0;
  } catch (error) {
    // Если директория не существует, возвращаем 0
    if (error.code === 'ENOENT') {
      return 0;
    }
    throw error;
  }
}

/**
 * Формирует путь к файлу с расчетом
 * @param id - Идентификатор расчета
 * @param version - Версия расчета
 * @returns Полный путь к файлу
 */
function calcPath(id: string, version: number): string {
  return path.join(CALC_DIR, `${id}_${version}.json`);
}

// Сохранение новой версии расчета
router.post('/:id/add', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const latest = await getLatestVersion(id);
    const next = latest + 1;
    await fs.mkdir(CALC_DIR, { recursive: true });
    await fs.writeFile(calcPath(id, next), JSON.stringify(data, null, 2), 'utf-8');
    res.json({ version: next });
  } catch (error) {
    console.error('Ошибка при сохранении расчета:', error);
    res.status(500).json({ error: 'Ошибка при сохранении расчета' });
  }
});

// Получение последней версии расчета
router.get('/:id/latest', async (req, res) => {
  try {
    const { id } = req.params;
    const latest = await getLatestVersion(id);
    if (!latest) return res.status(404).json({ error: 'Расчет не найден' });
    const data = await fs.readFile(calcPath(id, latest), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Ошибка при получении последней версии расчета:', error);
    res.status(500).json({ error: 'Ошибка при получении расчета' });
  }
});

// Получение конкретной версии расчета
router.get('/:id/:version', async (req, res) => {
  try {
    const { id, version } = req.params;
    const versionNumber = Number(version);
    if (isNaN(versionNumber)) {
      return res.status(400).json({ error: 'Неверный формат номера версии' });
    }
    const data = await fs.readFile(calcPath(id, versionNumber), 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Версия расчета не найдена' });
    }
    console.error('Ошибка при получении версии расчета:', error);
    res.status(500).json({ error: 'Ошибка при получении версии расчета' });
  }
});

// Сохранение расчета (с возможностью перезаписи)
router.post('/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const next = (await getLatestVersion(id)) + 1;
    await fs.writeFile(calcPath(id, next), JSON.stringify(data, null, 2), 'utf-8');
    res.json({ version: next });
  } catch (error) {
    console.error('Ошибка при сохранении расчета:', error);
    res.status(500).json({ error: 'Ошибка при сохранении расчета' });
  }
});

router.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const latest = await getLatestVersion(id);
  if (!latest) return res.status(404).end();
  await fs.unlink(calcPath(id, latest));
  res.json({ deletedVersion: latest });
});

router.get('/:id/pdf', async (req, res) => {
  // TODO: сгенерировать PDF и отдать
  const file = path.join(CALC_DIR, `${req.params.id}_latest.pdf`);
  res.download(file);
});

export default router;
