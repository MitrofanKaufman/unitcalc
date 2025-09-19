/**
 * Хук для работы с настройками приложения
 * Предоставляет доступ к настройкам и методы для их обновления
 */

import { useState, useEffect } from 'react';
import { AppSettings, defaultSettings, validateSettings } from '@/@types/settings';

// Ключ для хранения настроек в localStorage
const SETTINGS_STORAGE_KEY = 'wb_calculator_settings';

/**
 * Загружает настройки из localStorage
 */
function loadSettings(): AppSettings {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Проверяем, что загруженные настройки соответствуют типу AppSettings
      return { ...defaultSettings, ...parsedSettings };
    }
  } catch (error) {
    console.error('Ошибка при загрузке настроек:', error);
  }
  return defaultSettings;
}

/**
 * Хук для работы с настройками
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем настройки при монтировании
  useEffect(() => {
    setIsLoading(true);
    try {
      const loadedSettings = loadSettings();
      setSettings(loadedSettings);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить настройки');
      console.error('Ошибка при загрузке настроек:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Обновляет настройки
   * @param updates - объект с обновленными настройками
   */
  const updateSettings = (updates: Partial<AppSettings>) => {
    try {
      // Валидация обновлений
      const validationError = validateSettings(updates);
      if (validationError) {
        setError(validationError);
        return false;
      }

      // Применяем обновления
      const newSettings = { ...settings, ...updates };
      
      // Сохраняем в состояние
      setSettings(newSettings);
      
      // Сохраняем в localStorage
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      
      setError(null);
      return true;
    } catch (err) {
      setError('Ошибка при сохранении настроек');
      console.error('Ошибка при обновлении настроек:', err);
      return false;
    }
  };

  /**
   * Сбрасывает настройки к значениям по умолчанию
   */
  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  };

  return {
    settings,
    updateSettings,
    resetToDefaults,
    isLoading,
    error,
  };
}

/**
 * Получает значение настройки по пути
 * @example getSetting(settings, 'api.wildberriesApiKey')
 */
export function getSetting<T = any>(
  settings: AppSettings,
  path: string,
  defaultValue?: T
): T | undefined {
  try {
    const keys = path.split('.');
    let result: any = { ...settings };
    
    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  } catch (error) {
    console.error(`Ошибка при получении настройки ${path}:`, error);
    return defaultValue;
  }
}
