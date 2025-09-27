export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: 'Маршрут не найден',
        message: `Маршрут ${req.method} ${req.path} не существует`,
        availableRoutes: {
            units: '/api/units/*',
            currency: '/api/currency/*',
            calculations: '/api/calculations/*',
            scraping: '/api/scraping/*'
        }
    });
};
