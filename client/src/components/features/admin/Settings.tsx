import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
} from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Настройки
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Настройки административной панели WB Tools
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Общие настройки
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Здесь будут размещены настройки приложения, конфигурация API, параметры безопасности и другие административные опции.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Settings;
