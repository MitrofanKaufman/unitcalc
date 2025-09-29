import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
} from '@mui/material';

const Components: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Компоненты
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Доступные компоненты и инструменты WB Tools
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mt: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Калькулятор юнит-экономики
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Расчет прибыли, ROI и других метрик для товаров Wildberries.
              Поддерживает импорт данных из Excel и автоматическое обновление цен.
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Поиск товаров
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Инструмент для поиска товаров по различным параметрам: артикул, категория,
              бренд, цена. Поддерживает фильтры и экспорт результатов.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Components;
