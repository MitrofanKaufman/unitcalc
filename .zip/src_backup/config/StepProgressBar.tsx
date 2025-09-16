import React from 'react';
import { ProgressBar } from '@components/theme/ui/progress-bar';

interface StepProgressBarProps {
  /**
   * Текущий прогресс в процентах (0-100)
   */
  progress: number;

  /**
   * Текущий активный шаг
   */
  currentStep: string;

  /**
   * Список завершенных шагов
   */
  completedSteps?: string[];

  /**
   * Дополнительные классы для контейнера
   */
  className?: string;
}

/**
 * Компонент StepProgressBar отображает прогресс выполнения многошагового процесса
 * с возможностью отображения списка завершенных шагов.
 */
export const StepProgressBar: React.FC<StepProgressBarProps> = ({
                                                                  progress,
                                                                  currentStep,
                                                                  completedSteps = [],
                                                                  className = '',
                                                                }) => {
  return (
      <div className={`space-y-4 ${className}`}>
        {/* Прогресс-бар */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Прогресс</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar
              progress={progress}
              className="h-2.5"
          />
        </div>

        {/* Текущий шаг */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Текущий шаг:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentStep}
          </p>
        </div>

        {/* Завершенные шаги */}
        {completedSteps.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Выполнено:
              </p>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {completedSteps.map((step, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {step}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
};

export default StepProgressBar;
