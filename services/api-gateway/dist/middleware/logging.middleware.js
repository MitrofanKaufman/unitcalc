import { logger } from '@wb-calc/logging';
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    logger.info('Входящий запрос', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.method !== 'GET' ? req.body : undefined
    });
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Ответ отправлен', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });
    next();
};
