import { config } from 'dotenv';
import { app } from './app';
import { logger } from '@wb-calc/logging';
config();
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    logger.info(`API Gateway запущен на порту ${PORT}`);
    logger.info(`Документация API: http://localhost:${PORT}/api-docs`);
});
process.on('SIGTERM', () => {
    logger.info('Получен сигнал SIGTERM, завершение работы...');
    server.close(() => {
        logger.info('API Gateway остановлен');
    });
});
process.on('SIGINT', () => {
    logger.info('Получен сигнал SIGINT, завершение работы...');
    server.close(() => {
        logger.info('API Gateway остановлен');
    });
});
