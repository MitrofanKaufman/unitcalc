/**
 * Страница настроек системы
 * Позволяет настраивать параметры приложения, включая:
 * - API ключи и интеграции
 * - Параметры расчета рентабельности
 * - Настройки уведомлений
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'sonner';

export default function SettingsPage() {
  // Используем хук для работы с настройками
  const {
    settings,
    updateSettings,
    resetToDefaults,
    isLoading,
    error,
  } = useSettings();
  
  // Локальные состояния для формы
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('api');

  // Обновляем локальные настройки при загрузке
  React.useEffect(() => {
    if (!isLoading) {
      setLocalSettings(settings);
    }
  }, [settings, isLoading]);

  // Обработчик изменения значений полей
  const handleChange = (path: string, value: any) => {
    const keys = path.split('.');
    setLocalSettings(prev => {
      const newSettings = JSON.parse(JSON.stringify(prev));
      let current = newSettings;
      
      // Проходим по всем ключам, кроме последнего
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Устанавливаем значение последнего ключа
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  // Функция для сохранения настроек
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Обновляем настройки через хук
      const success = updateSettings(localSettings);
      
      if (success) {
        toast.success('Настройки успешно сохранены');
      } else {
        toast.error(error || 'Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      toast.error('Произошла ошибка при сохранении настроек');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Функция сброса настроек
  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?')) {
      resetToDefaults();
      toast.success('Настройки сброшены к значениям по умолчанию');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Настройки системы</h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="api">API Ключи</TabsTrigger>
          <TabsTrigger value="calculation">Расчеты</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Настройки API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Ключ Wildberries</Label>
                <Input 
                  id="apiKey"
                  type="password"
                  value={localSettings?.api?.wildberriesApiKey || ''}
                  onChange={(e) => handleChange('api.wildberriesApiKey', e.target.value)}
                  placeholder="Введите ваш API ключ"
                  disabled={isLoading || isSaving}
                />
                <p className="text-sm text-muted-foreground">
                  API ключ необходим для получения данных из личного кабинета Wildberries
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle>Параметры расчета</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commissionRate">Комиссия Wildberries (%)</Label>
                <Input 
                  id="commissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={localSettings?.calculation?.commissionRate || 0}
                  onChange={(e) => handleChange('calculation.commissionRate', Number(e.target.value))}
                  disabled={isLoading || isSaving}
                />
                <p className="text-sm text-muted-foreground">
                  Процент комиссии, взимаемый Wildberries с каждой продажи
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="notifications">Email уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления на электронную почту
                  </p>
                </div>
                <Switch 
                  id="notifications"
                  checked={localSettings?.notifications?.enableEmail || false}
                  onCheckedChange={(checked) => handleChange('notifications.enableEmail', checked)}
                  disabled={isLoading || isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline"
          onClick={handleReset}
          disabled={isLoading || isSaving}
        >
          Сбросить настройки
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => setActiveTab(prev => {
              const tabs = ['api', 'calculation', 'notifications'];
              const currentIndex = tabs.indexOf(prev);
              return currentIndex > 0 ? tabs[currentIndex - 1] : prev;
            })}
            disabled={activeTab === 'api' || isLoading || isSaving}
          >
            Назад
          </Button>
          
          {activeTab !== 'notifications' ? (
            <Button 
              variant="outline"
              onClick={() => {
                const tabs = ['api', 'calculation', 'notifications'];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex + 1]);
              }}
              disabled={isLoading || isSaving}
            >
              Далее
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              disabled={isLoading || isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
