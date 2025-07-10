// Основные типы для приложения заметок

export interface Note {
  id?: number; // Dexie автоматически генерирует числовой ID
  title: string; // максимум 100 символов
  content: string; // максимум 5000 символов
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCreate {
  title: string;
  content: string;
  tags: string[];
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface SearchFilters {
  query?: string;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchOptions {
  query: string;
  searchInContent?: boolean;
  searchInTags?: boolean;
  tags?: string[];
  limit?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  timestamp: Date;
}

// Типы для компонентов
export interface NoteFormProps {
  initialData?: Partial<NoteCreate>;
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

export interface NoteFormEvents {
  noteCreated: { note: NoteCreate; id: number };
  noteUpdated: { note: Note };
  cancel: void;
  error: { error: Error };
}

export interface SearchBarProps {
  placeholder?: string;
  debounceMs?: number;
  showResultsCount?: boolean;
  autoFocus?: boolean;
  maxResults?: number;
}

export interface SearchBarEvents {
  search: { query: string; results: Note[] };
  clear: void;
  select: { note: Note };
}

export interface NotesListProps {
  notes?: Note[];
  searchQuery?: string;
  selectedTags?: string[];
  showActions?: boolean;
  gridColumns?: 1 | 2 | 3 | 4;
  showLoadMore?: boolean;
  itemsPerPage?: number;
}

export interface NotesListEvents {
  noteAction: { action: 'view' | 'edit' | 'delete' | 'duplicate'; note: Note };
  loadMore: void;
  tagClick: { tag: string };
}

// Типы для состояния приложения
export interface AppState {
  notes: Note[];
  searchQuery: string;
  searchFilters: SearchFilters;
  selectedTags: string[];
  availableTags: string[];
  notifications: NotificationMessage[];
  isLoading: boolean;
  error: string | null;
}

// Типы для статистики
export interface NotesStatistics {
  totalNotes: number;
  totalTags: number;
  notesToday: number;
  notesThisWeek: number;
  notesThisMonth: number;
  averageNotesPerDay: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
}

// Типы для экспорта/импорта
export interface ExportData {
  version: string;
  exportDate: Date;
  notes: Note[];
  metadata: {
    totalNotes: number;
    exportedBy: string;
  };
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

// Типы для настроек приложения
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ru' | 'en';
  autoSave: boolean;
  defaultSortBy: 'createdAt' | 'updatedAt' | 'title';
  defaultSortOrder: 'asc' | 'desc';
  notesPerPage: number;
  showPreview: boolean;
  enableNotifications: boolean;
}

// Типы для валидации
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Типы для API ответов (если будет добавлен бэкенд)
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Утилитарные типы
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Типы для событий клавиатуры
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

// Типы для анимаций
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionConfig extends AnimationConfig {
  css?: (t: number, u: number) => string;
  tick?: (t: number, u: number) => void;
}

// Константы типов
export const NOTE_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  CONTENT_MAX_LENGTH: 5000,
  TAG_MAX_LENGTH: 50,
  MAX_TAGS_COUNT: 10
} as const;

export const SEARCH_LIMITS = {
  MIN_QUERY_LENGTH: 1,
  MAX_RESULTS: 100,
  DEFAULT_DEBOUNCE_MS: 300
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];