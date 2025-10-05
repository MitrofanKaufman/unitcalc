// \apps\web\src\lib\background\TaskManager.ts
// Менеджер фоновых заданий и отложенной обработки

/**
 * Типы заданий
 */
export enum TaskType {
  CALCULATION = 'calculation',
  SYNC = 'sync',
  EXPORT = 'export',
  IMPORT = 'import',
  ANALYSIS = 'analysis',
  SCRAPING = 'scraping',
  NOTIFICATION = 'notification'
}

/**
 * Статус задания
 */
export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

/**
 * Приоритет задания
 */
export enum TaskPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4
}

/**
 * Интерфейс задания
 */
export interface Task {
  id: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  data: any
  createdAt: string
  startedAt?: string
  completedAt?: string
  error?: string
  retryCount: number
  maxRetries: number
  progress?: number
}

/**
 * Результат выполнения задания
 */
export interface TaskResult<T = any> {
  success: boolean
  data?: T
  error?: string
  duration: number
}

/**
 * Конфигурация обработчика заданий
 */
export interface TaskHandlerConfig {
  maxConcurrentTasks: number
  retryDelay: number
  maxRetryDelay: number
  retryBackoffMultiplier: number
  taskTimeout: number
  cleanupInterval: number
}

/**
 * Обработчик заданий
 */
export type TaskHandler = (task: Task, updateProgress: (progress: number) => void) => Promise<TaskResult>

/**
 * Менеджер фоновых заданий
 */
export class TaskManager {
  private tasks: Map<string, Task> = new Map()
  private handlers: Map<TaskType, TaskHandler> = new Map()
  private runningTasks: Set<string> = new Set()
  private config: TaskHandlerConfig
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<TaskHandlerConfig> = {}) {
    this.config = {
      maxConcurrentTasks: 3,
      retryDelay: 1000,
      maxRetryDelay: 30000,
      retryBackoffMultiplier: 2,
      taskTimeout: 300000, // 5 минут
      cleanupInterval: 60000, // 1 минута
      ...config
    }

    this.setupCleanupTimer()
  }

  /**
   * Регистрация обработчика для типа заданий
   */
  registerHandler(type: TaskType, handler: TaskHandler): void {
    this.handlers.set(type, handler)
  }

  /**
   * Добавление задания в очередь
   */
  addTask(type: TaskType, data: any, priority: TaskPriority = TaskPriority.NORMAL): string {
    const task: Task = {
      id: this.generateTaskId(),
      type,
      priority,
      status: TaskStatus.PENDING,
      data,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    }

    this.tasks.set(task.id, task)
    this.processQueue()

    return task.id
  }

  /**
   * Отмена задания
   */
  cancelTask(taskId: string): boolean {
    const task = this.tasks.get(taskId)
    if (!task || task.status === TaskStatus.COMPLETED) {
      return false
    }

    task.status = TaskStatus.CANCELLED
    this.tasks.set(taskId, task)

    if (this.runningTasks.has(taskId)) {
      this.runningTasks.delete(taskId)
    }

    return true
  }

  /**
   * Получение статуса задания
   */
  getTaskStatus(taskId: string): Task | null {
    return this.tasks.get(taskId) || null
  }

  /**
   * Получение всех заданий
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  /**
   * Получение заданий по типу
   */
  getTasksByType(type: TaskType): Task[] {
    return this.getAllTasks().filter(task => task.type === type)
  }

  /**
   * Получение заданий по статусу
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.getAllTasks().filter(task => task.status === status)
  }

  /**
   * Очистка завершенных заданий старше указанного времени
   */
  cleanupOldTasks(maxAgeHours = 24): void {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
    const tasksToRemove: string[] = []

    for (const [taskId, task] of this.tasks.entries()) {
      if (task.completedAt && new Date(task.completedAt) < cutoffTime) {
        tasksToRemove.push(taskId)
      }
    }

    tasksToRemove.forEach(taskId => this.tasks.delete(taskId))
  }

  /**
   * Генерация уникального ID для задания
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Обработка очереди заданий
   */
  private async processQueue(): Promise<void> {
    const pendingTasks = this.getTasksByStatus(TaskStatus.PENDING)
      .sort((a, b) => b.priority - a.priority) // Сортировка по приоритету

    const availableSlots = this.config.maxConcurrentTasks - this.runningTasks.size

    if (availableSlots <= 0 || pendingTasks.length === 0) {
      return
    }

    const tasksToStart = pendingTasks.slice(0, availableSlots)

    for (const task of tasksToStart) {
      this.executeTask(task)
    }
  }

  /**
   * Выполнение задания
   */
  private async executeTask(task: Task): Promise<void> {
    const handler = this.handlers.get(task.type)
    if (!handler) {
      this.failTask(task, `Обработчик не найден для типа: ${task.type}`)
      return
    }

    task.status = TaskStatus.RUNNING
    task.startedAt = new Date().toISOString()
    this.runningTasks.add(task.id)
    this.tasks.set(task.id, task)

    try {
      // Создание таймаута
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Task timeout')), this.config.taskTimeout)
      })

      const executePromise = new Promise<TaskResult>(async (resolve) => {
        try {
          let progress = 0
          const updateProgress = (newProgress: number) => {
            progress = Math.max(0, Math.min(100, newProgress))
            task.progress = progress
            this.tasks.set(task.id, task)
          }

          const result = await handler(task, updateProgress)
          resolve(result)
        } catch (error) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration: 0
          })
        }
      })

      const result = await Promise.race([executePromise, timeoutPromise])

      if (result.success) {
        this.completeTask(task, result)
      } else {
        throw new Error(result.error)
      }

    } catch (error) {
      await this.retryOrFail(task, error instanceof Error ? error.message : 'Unknown error')
    } finally {
      this.runningTasks.delete(task.id)
      this.processQueue() // Проверяем следующее задание
    }
  }

  /**
   * Завершение задания успешно
   */
  private completeTask(task: Task, result: TaskResult): void {
    task.status = TaskStatus.COMPLETED
    task.completedAt = new Date().toISOString()
    task.progress = 100
    this.tasks.set(task.id, task)

    console.log(`Задание ${task.id} выполнено успешно за ${result.duration}мс`)
  }

  /**
   * Провал задания с возможностью повтора
   */
  private async retryOrFail(task: Task, error: string): Promise<void> {
    if (task.retryCount < task.maxRetries) {
      task.retryCount++
      task.status = TaskStatus.PENDING
      task.error = error

      // Экспоненциальная задержка
      const delay = Math.min(
        this.config.retryDelay * Math.pow(this.config.retryBackoffMultiplier, task.retryCount - 1),
        this.config.maxRetryDelay
      )

      this.tasks.set(task.id, task)

      setTimeout(() => {
        this.processQueue()
      }, delay)

      console.log(`Задание ${task.id} будет повторено через ${delay}мс (попытка ${task.retryCount}/${task.maxRetries})`)
    } else {
      this.failTask(task, error)
    }
  }

  /**
   * Финальный провал задания
   */
  private failTask(task: Task, error: string): void {
    task.status = TaskStatus.FAILED
    task.completedAt = new Date().toISOString()
    task.error = error
    this.tasks.set(task.id, task)

    console.error(`Задание ${task.id} провалено: ${error}`)
  }

  /**
   * Настройка таймера очистки
   */
  private setupCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupOldTasks()
    }, this.config.cleanupInterval)
  }

  /**
   * Остановка менеджера
   */
  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }

    // Отменяем все выполняющиеся задания
    for (const taskId of this.runningTasks) {
      this.cancelTask(taskId)
    }
  }

  /**
   * Получение статистики
   */
  getStats(): {
    total: number
    pending: number
    running: number
    completed: number
    failed: number
    cancelled: number
    averageExecutionTime: number
  } {
    const tasks = this.getAllTasks()
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED)

    let totalExecutionTime = 0
    if (completedTasks.length > 0 && completedTasks[0].startedAt && completedTasks[0].completedAt) {
      totalExecutionTime = completedTasks.reduce((sum, task) => {
        if (task.startedAt && task.completedAt) {
          return sum + (new Date(task.completedAt).getTime() - new Date(task.startedAt).getTime())
        }
        return sum
      }, 0)
    }

    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      running: this.runningTasks.size,
      completed: completedTasks.length,
      failed: tasks.filter(t => t.status === TaskStatus.FAILED).length,
      cancelled: tasks.filter(t => t.status === TaskStatus.CANCELLED).length,
      averageExecutionTime: completedTasks.length > 0 ? totalExecutionTime / completedTasks.length : 0
    }
  }
}

// Экспорт singleton instance
export const taskManager = new TaskManager()
