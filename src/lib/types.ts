/**
 * Интерфейс для заметки
 */
export interface Note {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Тип для создания новой заметки (без id и дат)
 */
export type CreateNoteData = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Тип для обновления заметки
 */
export type UpdateNoteData = Partial<CreateNoteData> & { id: number };

/**
 * Интерфейс для состояния загрузки
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Интерфейс для фильтров поиска
 */
export interface SearchFilters {
  query: string;
  tags: string[];
}