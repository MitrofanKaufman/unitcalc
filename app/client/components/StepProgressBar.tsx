import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

// Тип для статуса шага
type StepStatus = 'completed' | 'current' | 'upcoming';

// Тип для шага
type Step = {
  id: string;
  label: string;
  status: StepStatus;
};

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
   * Список всех шагов в правильном порядке
   */
  steps: Step[];

  /**
   * Сообщение об ошибке (если есть)
   */
  error?: string;

  /**
   * Дополнительные классы для контейнера
   */
  className?: string;

  /**
   * Callback при клике на шаг
   */
  onStepClick?: (stepId: string) => void;
}

/**
 * Компонент StepProgressBar отображает прогресс выполнения многошагового процесса
 * с анимациями и возможностью навигации между шагами.
 */
export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  progress,
  currentStep,
  steps = [],
  error,
  className = '',
  onStepClick,
}) => {
  // Нормализуем прогресс в пределах 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Находим индекс текущего шага
  const currentStepIndex = useMemo(() => 
    steps.findIndex(step => step.id === currentStep),
    [steps, currentStep]
  );
  
  // Группируем шаги по статусу
  const { completedSteps, upcomingSteps } = useMemo(() => {
    return {
      completedSteps: steps.filter(step => step.status === 'completed'),
      upcomingSteps: steps.filter(step => step.status === 'upcoming')
    };
  }, [steps]);
  return (
    <div className={cn('space-y-6', className)}>
      {/* Прогресс-бар */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-foreground">Прогресс</span>
          <span className="text-muted-foreground">{Math.round(normalizedProgress)}%</span>
        </div>
        <Progress 
          value={normalizedProgress} 
          className="h-2.5"
          indicatorClassName={cn(
            'transition-all duration-500 ease-in-out',
            {
              'bg-destructive': error,
              'bg-primary': !error
            }
          )}
        />
      </div>

      {/* Список шагов */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Ход выполнения:</h3>
        
        <div className="space-y-3">
          <AnimatePresence>
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isCurrent = step.id === currentStep;
              const isUpcoming = step.status === 'upcoming';
              const stepNumber = index + 1;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center p-3 rounded-lg transition-colors',
                    'hover:bg-accent/50',
                    {
                      'bg-accent/30': isCurrent,
                      'cursor-pointer': onStepClick,
                    }
                  )}
                  onClick={() => onStepClick?.(step.id)}
                >
                  {/* Номер шага / иконка */}
                  <div 
                    className={cn(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3',
                      'transition-colors',
                      {
                        'bg-primary text-primary-foreground': isCurrent,
                        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400': isCompleted,
                        'bg-muted text-muted-foreground': isUpcoming,
                      }
                    )}
                    aria-hidden="true"
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">{stepNumber}</span>
                    )}
                  </div>
                  
                  {/* Текст шага */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className={cn(
                        'text-sm font-medium',
                        {
                          'text-foreground': isCurrent,
                          'text-muted-foreground': !isCurrent,
                        }
                      )}
                    >
                      {step.label}
                    </p>
                    
                    {isCurrent && error && (
                      <div className="flex items-center mt-1 text-xs text-destructive">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    {isCurrent && !error && (
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>В процессе...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Стрелка перехода */}
                  {onStepClick && (
                    <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Блок с информацией о завершенных шагах */}
      {completedSteps.length > 0 && (
        <div className="pt-2 border-t border-border">
          <h3 className="mb-2 text-sm font-medium text-foreground">Завершено:</h3>
          <ul className="space-y-2">
            {completedSteps.map((step) => (
              <li 
                key={step.id}
                className="flex items-center text-sm text-muted-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>{step.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Блок с предстоящими шагами, если есть */}
      {upcomingSteps.length > 0 && currentStepIndex < steps.length - 1 && (
        <div className="pt-2 border-t border-border">
          <h3 className="mb-2 text-sm font-medium text-foreground">Далее:</h3>
          <ul className="space-y-2">
            {upcomingSteps.map((step) => (
              <li 
                key={step.id}
                className="flex items-center text-sm text-muted-foreground"
              >
                <Clock className="w-4 h-4 mr-2 text-muted-foreground/70" />
                <span>{step.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StepProgressBar;
