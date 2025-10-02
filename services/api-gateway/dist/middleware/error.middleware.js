import { logger } from '@wb-calc/logging';
export const errorHandler = (err, req, res, next) => {
    logger.error('API Error', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Ошибка валидации',
            message: err.message
        });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Неверный формат данных',
            message: 'Проверьте корректность ID или параметров'
        });
    }
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла непредвиденная ошибка'
    });
};
