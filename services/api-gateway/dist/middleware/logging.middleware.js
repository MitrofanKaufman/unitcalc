import { log } from '@wb-calc/logging';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    log('Входящий запрос: ' + req.method + ' ' + req.url);
    res.on('finish', () => {
        const duration = Date.now() - start;
        log(`Ответ отправлен: ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
