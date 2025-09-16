import { Router } from 'express';

// Заглушка маршрута расчёта калькулятора.
// Пока реализация отключена, чтобы избежать ошибок экспорта,
// возвращаем 501 Not Implemented на любой запрос.
const router = Router();

router.all('*', (_, res) => {
  res.status(501).json({ error: 'calculate parser disabled' });
});

export default router;
