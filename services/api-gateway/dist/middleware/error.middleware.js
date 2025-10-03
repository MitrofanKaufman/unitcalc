import { error as logError } from '@wb-calc/logging';
export const errorHandler = (err, req, res, next) => {
    logError('API Error', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Ошибка валидации',
            message: err.message
        });
        return;
    }
    if (err.name === 'CastError') {
        res.status(400).json({
            error: 'Неверный формат данных',
            message: 'Проверьте корректность ID или параметров'
        });
        return;
    }
    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла непредвиденная ошибка'
    });
};
