import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Update as UpdateIcon,
  Add as AddIcon,
  BugReport as BugIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

const Changelog: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Журнал изменений
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        История обновлений и улучшений WB Tools
      </Typography>

      <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <AddIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="v1.0.0 - Релиз админ панели"
              secondary="Добавлена административная панель с разделом документации, настройками и управлением компонентами."
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <CheckIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="v0.9.0 - Стабилизация"
              secondary="Исправлены ошибки в документации, улучшена производительность компонентов."
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <UpdateIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="v0.8.0 - Улучшения UI"
              secondary="Обновлен дизайн интерфейса, добавлена поддержка темной темы."
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <BugIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary="v0.7.0 - Исправления ошибок"
              secondary="Критические исправления в работе с API, улучшена обработка ошибок."
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Changelog;
