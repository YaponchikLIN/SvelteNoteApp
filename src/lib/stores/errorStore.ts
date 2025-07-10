import { writable } from 'svelte/store';
import type { ErrorInfo, ErrorType, ErrorSeverity } from '$lib/types';

// Интерфейс для ошибки в системе
interface AppError extends ErrorInfo {
  id: string;
  timestamp: Date;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

// Хранилище для ошибок
export const errors = writable<AppError[]>([]);

// Хранилище для текущей ошибки (для отображения)
export const currentError = writable<AppError | null>(null);

// Счетчик для генерации уникальных ID
let errorCounter = 0;

// Класс для управления ошибками
class ErrorManager {
  private maxErrors = 50; // Максимальное количество сохраняемых ошибок
  private errorQueue: AppError[] = [];

  constructor() {
    // Подписываемся на глобальные ошибки
    this.setupGlobalErrorHandlers();
  }

  // Настройка глобальных обработчиков ошибок
  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Обработка JavaScript ошибок
      window.addEventListener('error', (event) => {
        this.handleError(event.error || new Error(event.message), {
          type: 'error',
          severity: 'high',
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Обработка Promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          {
            type: 'error',
            severity: 'high',
            context: { type: 'unhandledPromiseRejection' }
          }
        );
      });

      // Обработка сетевых ошибок
      window.addEventListener('offline', () => {
        this.handleError(new Error('Соединение с интернетом потеряно'), {
          type: 'network',
          severity: 'medium',
          title: 'Нет соединения'
        });
      });

      window.addEventListener('online', () => {
        this.showSuccess('Соединение с интернетом восстановлено');
      });
    }
  }

  // Основной метод для обработки ошибок
  handleError(
    error: Error | string,
    options: Partial<ErrorInfo> = {}
  ): string {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    const appError: AppError = {
      id: `error-${++errorCounter}`,
      timestamp: new Date(),
      error: errorObj,
      type: options.type || 'error',
      severity: options.severity || 'medium',
      title: options.title || this.getDefaultTitle(options.type || 'error'),
      message: options.message || errorObj.message,
      details: options.details || errorObj.stack,
      retryable: options.retryable || false,
      context: {
        ...options.context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
    };

    // Добавляем ошибку в очередь
    this.errorQueue.push(appError);
    
    // Ограничиваем количество ошибок
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue = this.errorQueue.slice(-this.maxErrors);
    }

    // Обновляем хранилища
    errors.set([...this.errorQueue]);
    currentError.set(appError);

    // Логируем ошибку
    this.logError(appError);

    // Отправляем ошибку на сервер (если настроено)
    this.reportError(appError);

    return appError.id;
  }

  // Обработка специфических типов ошибок
  handleValidationError(field: string, message: string): string {
    return this.handleError(new Error(message), {
      type: 'validation',
      severity: 'low',
      title: 'Ошибка валидации',
      context: { field }
    });
  }

  handleNetworkError(url: string, status?: number): string {
    return this.handleError(new Error(`Ошибка сети: ${status || 'неизвестная ошибка'}`), {
      type: 'network',
      severity: 'medium',
      title: 'Ошибка сети',
      context: { url, status },
      retryable: true
    });
  }

  handleStorageError(operation: string, error: Error): string {
    return this.handleError(error, {
      type: 'storage',
      severity: 'high',
      title: 'Ошибка хранилища',
      context: { operation }
    });
  }

  handlePermissionError(resource: string): string {
    return this.handleError(new Error(`Нет доступа к ресурсу: ${resource}`), {
      type: 'permission',
      severity: 'medium',
      title: 'Ошибка доступа',
      context: { resource }
    });
  }

  handleTimeoutError(operation: string, timeout: number): string {
    return this.handleError(new Error(`Операция "${operation}" превысила время ожидания (${timeout}мс)`), {
      type: 'timeout',
      severity: 'medium',
      title: 'Превышено время ожидания',
      context: { operation, timeout },
      retryable: true
    });
  }

  // Показать успешное уведомление
  showSuccess(message: string, title: string = 'Успешно'): void {
    const successError: AppError = {
      id: `success-${++errorCounter}`,
      timestamp: new Date(),
      error: new Error(message),
      type: 'info',
      severity: 'low',
      title,
      message,
      details: '',
      retryable: false
    };

    currentError.set(successError);
  }

  // Показать предупреждение
  showWarning(message: string, title: string = 'Предупреждение'): void {
    this.handleError(new Error(message), {
      type: 'warning',
      severity: 'low',
      title
    });
  }

  // Показать информационное сообщение
  showInfo(message: string, title: string = 'Информация'): void {
    this.handleError(new Error(message), {
      type: 'info',
      severity: 'low',
      title
    });
  }

  // Очистить текущую ошибку
  clearCurrentError(): void {
    currentError.set(null);
  }

  // Очистить все ошибки
  clearAllErrors(): void {
    this.errorQueue = [];
    errors.set([]);
    currentError.set(null);
  }

  // Получить ошибку по ID
  getErrorById(id: string): AppError | undefined {
    return this.errorQueue.find(error => error.id === id);
  }

  // Удалить ошибку по ID
  removeError(id: string): void {
    this.errorQueue = this.errorQueue.filter(error => error.id !== id);
    errors.set([...this.errorQueue]);
  }

  // Получить статистику ошибок
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: AppError[];
  } {
    const byType: Record<ErrorType, number> = {
      error: 0,
      warning: 0,
      info: 0,
      network: 0,
      validation: 0,
      permission: 0,
      timeout: 0,
      storage: 0
    };

    const bySeverity: Record<ErrorSeverity, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    this.errorQueue.forEach(error => {
      byType[error.type]++;
      bySeverity[error.severity]++;
    });

    const recent = this.errorQueue
      .slice(-10)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      total: this.errorQueue.length,
      byType,
      bySeverity,
      recent
    };
  }

  // Экспорт ошибок для отладки
  exportErrors(): string {
    return JSON.stringify(this.errorQueue, null, 2);
  }

  // Получение заголовка по умолчанию
  private getDefaultTitle(type: ErrorType): string {
    const titles = {
      error: 'Ошибка',
      warning: 'Предупреждение',
      info: 'Информация',
      network: 'Ошибка сети',
      validation: 'Ошибка валидации',
      permission: 'Ошибка доступа',
      timeout: 'Превышено время ожидания',
      storage: 'Ошибка хранилища'
    };
    return titles[type] || 'Ошибка';
  }

  // Логирование ошибки
  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.severity);
    const logMessage = `[${error.type.toUpperCase()}] ${error.title}: ${error.message}`;
    
    if (typeof console !== 'undefined') {
      switch (logLevel) {
        case 'error':
          console.error(logMessage, error);
          break;
        case 'warn':
          console.warn(logMessage, error);
          break;
        case 'info':
          console.info(logMessage, error);
          break;
        default:
          console.log(logMessage, error);
      }
    }
  }

  // Получение уровня логирования
  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' | 'log' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      case 'low':
        return 'info';
      default:
        return 'log';
    }
  }

  // Отправка ошибки на сервер (заглушка)
  private async reportError(error: AppError): Promise<void> {
    // В реальном приложении здесь была бы отправка на сервер
    // Например, в Sentry, LogRocket или собственный API
    
    if (error.severity === 'critical' || error.severity === 'high') {
      // Отправляем только критические и важные ошибки
      try {
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(error)
        // });
      } catch (reportingError) {
        console.error('Не удалось отправить ошибку на сервер:', reportingError);
      }
    }
  }
}

// Создаем глобальный экземпляр менеджера ошибок
export const errorManager = new ErrorManager();

// Экспортируем удобные функции
export const {
  handleError,
  handleValidationError,
  handleNetworkError,
  handleStorageError,
  handlePermissionError,
  handleTimeoutError,
  showSuccess,
  showWarning,
  showInfo,
  clearCurrentError,
  clearAllErrors,
  getErrorById,
  removeError,
  getErrorStats,
  exportErrors
} = errorManager;

// Утилиты для работы с ошибками
export const errorUtils = {
  // Проверка, является ли ошибка сетевой
  isNetworkError: (error: Error): boolean => {
    return error.message.includes('fetch') || 
           error.message.includes('network') ||
           error.message.includes('Failed to fetch');
  },

  // Проверка, является ли ошибка ошибкой валидации
  isValidationError: (error: Error): boolean => {
    return error.message.includes('validation') ||
           error.message.includes('invalid') ||
           error.message.includes('required');
  },

  // Получение пользовательского сообщения для ошибки
  getUserFriendlyMessage: (error: Error): string => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Проблема с подключением к интернету. Проверьте соединение и попробуйте снова.';
    }
    
    if (message.includes('timeout')) {
      return 'Операция заняла слишком много времени. Попробуйте снова.';
    }
    
    if (message.includes('permission') || message.includes('unauthorized')) {
      return 'У вас нет прав для выполнения этого действия.';
    }
    
    if (message.includes('storage') || message.includes('quota')) {
      return 'Недостаточно места для сохранения данных.';
    }
    
    return error.message;
  },

  // Определение типа ошибки по сообщению
  getErrorType: (error: Error): ErrorType => {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) return 'network';
    if (message.includes('validation') || message.includes('invalid')) return 'validation';
    if (message.includes('permission') || message.includes('unauthorized')) return 'permission';
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('storage') || message.includes('quota')) return 'storage';
    
    return 'error';
  },

  // Определение серьезности ошибки
  getErrorSeverity: (error: Error): ErrorSeverity => {
    const message = error.message.toLowerCase();
    
    if (message.includes('critical') || message.includes('fatal')) return 'critical';
    if (message.includes('storage') || message.includes('permission')) return 'high';
    if (message.includes('network') || message.includes('timeout')) return 'medium';
    
    return 'low';
  }
};