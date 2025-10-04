import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Container,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  Update as UpdateIcon,
  BugReport as BugIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Widgets as WidgetsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Settings from './Settings';
import Components from './Components';
import Changelog from './Changelog';

interface AdminSection {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const adminSections: AdminSection[] = [
    {
      id: 'documentation',
      title: 'Документация',
      path: '/admin/documentation',
      icon: <ArticleIcon />,
      component: DocumentationContent,
    },
    {
      id: 'settings',
      title: 'Настройки',
      path: '/admin/settings',
      icon: <SettingsIcon />,
      component: Settings,
    },
    {
      id: 'components',
      title: 'Компоненты',
      path: '/admin/components',
      icon: <WidgetsIcon />,
      component: Components,
    },
    {
      id: 'changelog',
      title: 'Журнал изменений',
      path: '/admin/changelog',
      icon: <HistoryIcon />,
      component: Changelog,
    },
  ];

  const handleSectionChange = (sectionId: string) => {
    const section = adminSections.find(s => s.id === sectionId);
    if (section) {
      navigate(section.path);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Фильтрация разделов по поисковому запросу
  const filteredSections = searchQuery.trim()
    ? adminSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : adminSections;

  const currentSection = adminSections.find(section =>
    location.pathname === section.path
  ) || adminSections[0];

  const CurrentComponent = currentSection.component;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Админ панель - WB Tools
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Управление и настройка инструментов для работы с Wildberries
      </Typography>

      {/* Панель навигации и поиска */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Выберите раздел</InputLabel>
            <Select
              value={currentSection.id}
              label="Выберите раздел"
              onChange={(e) => handleSectionChange(e.target.value)}
            >
              {adminSections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{section.title}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            placeholder="Поиск по разделам..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>
      </Paper>

      {/* Результаты поиска или активный раздел */}
      {searchQuery.trim() ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Результаты поиска: "{searchQuery}"
          </Typography>
          {filteredSections.length === 0 ? (
            <Alert severity="info">Ничего не найдено. Попробуйте изменить поисковый запрос.</Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {filteredSections.map((section) => (
                <Paper key={section.id} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                       onClick={() => handleSectionChange(section.id)}>
                    <Box sx={{ mr: 2 }}>
                      {/* @ts-ignore */}
                      {section.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        {section.title}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        /* Отображение активного раздела */
        <CurrentComponent />
      )}
    </Container>
  );
};

// Внутренний компонент для контента документации
const DocumentationContent: React.FC = () => {
  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Быстрый старт',
      description: 'Основные шаги для начала работы с WB Tools',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            WB Tools - это набор инструментов для работы с Wildberries API и аналитики продаж.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Установка зависимостей"
                secondary="Выполните команду npm install для установки всех необходимых пакетов"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Настройка API ключей"
                secondary="Получите API ключи Wildberries и настройте их в конфигурации приложения"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Запуск приложения"
                secondary="Выполните команду npm run dev для запуска в режиме разработки"
              />
            </ListItem>
          </List>
        </Box>
      ),
      tags: ['основы', 'настройка', 'запуск'],
      status: 'completed',
    },
    {
      id: 'api-reference',
      title: 'API документация',
      description: 'Справочник по использованию Wildberries API',
      content: (
        <Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Документация по API обновляется автоматически при изменении версий Wildberries API
          </Alert>
          <Typography variant="body1" paragraph>
            Основные методы API:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Аналитика продаж
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Получение данных о продажах, остатках и статистике
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Управление товарами
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Создание, обновление и управление карточками товаров
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      ),
      tags: ['API', 'справочник', 'методы'],
      status: 'in-progress',
    },
    {
      id: 'components',
      title: 'Компоненты интерфейса',
      description: 'Описание доступных компонентов и их использование',
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Система компонентов построена на Material-UI с дополнительными кастомными компонентами.
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Калькулятор юнит-экономики</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Компонент для расчета прибыли, ROI и других метрик для товаров Wildberries.
                Поддерживает импорт данных из Excel и автоматическое обновление цен.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Поиск товаров</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">
                Инструмент для поиска товаров по различным параметрам: артикул, категория,
                бренд, цена. Поддерживает фильтры и экспорт результатов.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      ),
      tags: ['компоненты', 'UI', 'Material-UI'],
      status: 'completed',
    },
    {
      id: 'deployment',
      title: 'Развертывание',
      description: 'Инструкции по развертыванию приложения в продакшн',
      content: (
        <Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Перед развертыванием убедитесь, что все тесты проходят и нет критических уязвимостей
          </Alert>
          <Typography variant="body1" paragraph>
            Шаги развертывания:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Сборка приложения"
                secondary="Выполните команду npm run build для создания продакшн сборки"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CodeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Настройка сервера"
                secondary="Настройте веб-сервер (nginx, apache) для обслуживания статических файлов"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText
                primary="SSL сертификат"
                secondary="Настройте HTTPS для безопасного соединения"
              />
            </ListItem>
          </List>
        </Box>
      ),
      tags: ['развертывание', 'продакшн', 'настройка'],
      status: 'planned',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'planned':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in-progress':
        return <UpdateIcon />;
      case 'planned':
        return <BugIcon />;
      default:
        return <BugIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Документация
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Полная документация по WB Tools - инструментам для работы с Wildberries
      </Typography>

      <Box sx={{ mt: 4 }}>
        {documentationSections.map((section) => (
          <Accordion key={section.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mr: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(section.status)}
                  <Chip
                    label={section.status === 'completed' ? 'Готово' :
                           section.status === 'in-progress' ? 'В процессе' : 'Запланировано'}
                    color={getStatusColor(section.status)}
                    size="small"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {section.description}
              </Typography>
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                {section.content}
              </Paper>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {section.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default Documentation;
