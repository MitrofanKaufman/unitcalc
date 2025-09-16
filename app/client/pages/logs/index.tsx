// path: src/pages/logs/index.tsx
/**
 * Страница для просмотра системных логов приложения
 * Позволяет просматривать логи в реальном времени, фильтровать их по уровню и искать по содержимому
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Типы для логов
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'all';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

// Моковые данные для демонстрации
const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    level: 'info',
    message: 'Приложение успешно запущено',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    level: 'warn',
    message: 'Обнаружены устаревшие настройки, применены значения по умолчанию',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    level: 'error',
    message: 'Ошибка при загрузке данных пользователя',
    meta: { userId: '12345' },
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    level: 'debug',
    message: 'Запрос к API выполнен успешно',
    meta: { endpoint: '/api/products', status: 200 },
  },
];

const LogsPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<LogLevel>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Загрузка логов (в реальном приложении - запрос к API)
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // В реальном приложении здесь будет запрос к API
      // const response = await fetch('/api/logs');
      // const data = await response.json();
      // setLogs(data);
      
      // Используем моковые данные для демонстрации
      setLogs(MOCK_LOGS);
    } catch (error) {
      console.error('Ошибка при загрузке логов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Автоматическая загрузка логов при монтировании
  useEffect(() => {
    fetchLogs();
    
    // В реальном приложении можно настроить WebSocket для получения логов в реальном времени
    let intervalId: NodeJS.Timeout;
    if (autoRefresh) {
      intervalId = setInterval(fetchLogs, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  // Прокрутка к последнему логу при обновлении
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Фильтрация логов по уровню и поисковому запросу
  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.meta && JSON.stringify(log.meta).toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesLevel && matchesSearch;
  });

  // Очистка логов
  const clearLogs = () => {
    // В реальном приложении здесь будет запрос на очистку логов на сервере
    setLogs([]);
  };

  // Получение цвета для уровня логирования
  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warn':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'debug':
        return 'text-purple-500';
      default:
        return 'text-foreground';
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Заголовок и навигация */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Системные логи</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-primary/10' : ''}
          >
            {autoRefresh ? 'Автообновление: Вкл' : 'Автообновление: Выкл'}
          </Button>
          <Button
            variant="destructive"
            onClick={clearLogs}
            disabled={logs.length === 0}
          >
            Очистить логи
          </Button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск по логам..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Уровень:</span>
          <Select
            value={selectedLevel}
            onValueChange={(value: LogLevel) => setSelectedLevel(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все уровни</SelectItem>
              <SelectItem value="error">Ошибки</SelectItem>
              <SelectItem value="warn">Предупреждения</SelectItem>
              <SelectItem value="info">Информация</SelectItem>
              <SelectItem value="debug">Отладка</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Список логов */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Журнал событий</CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredLogs.length} записей
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {isLoading ? (
              <div className="p-6 text-center text-muted-foreground">
                Загрузка логов...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Логи не найдены. Попробуйте изменить параметры фильтрации.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${getLogLevelColor(log.level)}`}>
                            {log.level.toUpperCase()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm break-words">{log.message}</p>
                        {log.meta && (
                          <pre className="mt-2 p-2 bg-muted/50 rounded-md text-xs overflow-x-auto">
                            {JSON.stringify(log.meta, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
