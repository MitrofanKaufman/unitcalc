// C:\Users\Mitrofan Kaufman\WebstormProjects\wb-calc\packages\ui\src\components\DataCollection\ProgressIndicator.tsx
/**
 * path/to/file.ts
 * Описание: Компонент для визуализации прогресса сбора данных
 * Логика: Клиентская (React компонент)
 * Зависимости: React, типы для прогресса сбора данных
 * Примечания: Показывает прогресс-бар, текущий шаг и возможные ошибки
 */

import React, { useEffect, useRef } from 'react';
import styles from './ProgressIndicator.module.css';

interface CollectionProgress {
  currentStep: string;
  totalSteps: number;
  percentage: number;
  message: string;
  errors: string[];
  data?: any;
}

interface ProgressIndicatorProps {
  progress: CollectionProgress;
  title?: string;
  showDetails?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  title = 'Сбор данных',
  showDetails = true,
  className = ''
}) => {
  const getStatusColor = (percentage: number) => {
    if (percentage < 30) return styles.progressBlue;
    if (percentage < 70) return styles.progressYellow;
    if (percentage < 100) return styles.progressGreen;
    return styles.progressDarkGreen;
  };

  const getStatusText = (percentage: number) => {
    if (percentage < 30) return 'Начинаем сбор данных...';
    if (percentage < 70) return 'Собираем информацию...';
    if (percentage < 100) return 'Завершаем процесс...';
    return 'Сбор данных завершен!';
  };

  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${progress.percentage}%`;
    }
  }, [progress.percentage]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm font-medium text-gray-600">
          {progress.percentage}%
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className={styles.progressBar}>
        <div
          ref={progressFillRef}
          className={`${styles.progressFill} ${getStatusColor(progress.percentage)}`}
        />
      </div>

      {/* Статус сообщения */}
      <div className="flex items-center justify-between mb-3">
        <span className={styles.statusMessage}>
          {getStatusText(progress.percentage)}
        </span>
        <span className={styles.statusStep}>
          Шаг {progress.currentStep} из {progress.totalSteps}
        </span>
      </div>

      {/* Детальная информация */}
      {showDetails && (
        <div className="space-y-2">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Текущий шаг:</span> {progress.message}
          </div>

          {progress.errors.length > 0 && (
            <div className={styles.errorContainer}>
              <div className={styles.errorTitle}>
                Обнаружены ошибки:
              </div>
              {progress.errors.map((error, index) => (
                <div key={index} className={styles.errorText}>
                  • {error}
                </div>
              ))}
            </div>
          )}

          {/* Частичные данные */}
          {progress.data && Object.keys(progress.data).length > 0 && (
            <div className={styles.dataContainer}>
              <div className={styles.dataTitle}>
                Собранные данные:
              </div>
              <div className="text-xs text-green-600">
                {Object.entries(progress.data).map(([key, value]) => (
                  <div key={key}>
                    {key}: {String(value)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
