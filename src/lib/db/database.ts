import Dexie, { type Table } from 'dexie';

// Интерфейс для заметки
export interface Note {
  id?: number; // Автоинкремент ID
  title: string; // максимум 100 символов
  content: string; // максимум 5000 символов
  tags: string[]; // массив тегов
  createdAt: Date; // дата создания
  updatedAt: Date; // дата последнего обновления
}

// Интерфейс для создания заметки (без id, createdAt, updatedAt)
export interface NoteCreate {
  title: string;
  content: string;
  tags: string[];
}

// Интерфейс для обновления заметки
export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
}

// Интерфейс для результатов поиска
export interface SearchOptions {
  query?: string; // поисковый запрос
  tags?: string[]; // фильтр по тегам
  limit?: number; // лимит результатов
  offset?: number; // смещение для пагинации
}

// Ошибки валидации
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Класс базы данных
export class NotesDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('NotesDatabase');
    
    // Определяем схему базы данных
    this.version(1).stores({
      // Создаем индексы для эффективного поиска
      notes: '++id, title, content, *tags, createdAt, updatedAt'
    });

    // Хук для автоматического добавления временных меток
    this.notes.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.notes.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });
  }
}

// Создаем экземпляр базы данных
export const db = new NotesDatabase();

// Утилиты для валидации
export const validation = {
  validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Заголовок не может быть пустым');
    }
    if (title.length > 100) {
      throw new ValidationError('Заголовок не может быть длиннее 100 символов');
    }
  },

  validateContent(content: string): void {
    if (!content || content.trim().length === 0) {
      throw new ValidationError('Содержимое не может быть пустым');
    }
    if (content.length > 5000) {
      throw new ValidationError('Содержимое не может быть длиннее 5000 символов');
    }
  },

  validateTags(tags: string[]): void {
    if (!Array.isArray(tags)) {
      throw new ValidationError('Теги должны быть массивом');
    }
    
    // Проверяем каждый тег
    tags.forEach((tag, index) => {
      if (typeof tag !== 'string') {
        throw new ValidationError(`Тег ${index + 1} должен быть строкой`);
      }
      if (tag.trim().length === 0) {
        throw new ValidationError(`Тег ${index + 1} не может быть пустым`);
      }
      if (tag.length > 50) {
        throw new ValidationError(`Тег "${tag}" слишком длинный (максимум 50 символов)`);
      }
    });

    // Проверяем на дубликаты
    const uniqueTags = new Set(tags.map(tag => tag.toLowerCase()));
    if (uniqueTags.size !== tags.length) {
      throw new ValidationError('Теги не должны повторяться');
    }
  },

  validateNote(note: NoteCreate): void {
    this.validateTitle(note.title);
    this.validateContent(note.content);
    this.validateTags(note.tags);
  }
};

// CRUD операции
export const notesService = {
  // Создание новой заметки
  async createNote(noteData: NoteCreate): Promise<number> {
    try {
      // Валидация данных
      validation.validateNote(noteData);

      // Очищаем и нормализуем данные
      const cleanNote: NoteCreate = {
        title: noteData.title.trim(),
        content: noteData.content.trim(),
        tags: noteData.tags
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .map(tag => tag.toLowerCase())
      };

      // Добавляем заметку в базу данных
      const id = await db.notes.add(cleanNote as Note);
      return id as number;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Ошибка создания заметки: ${error}`);
    }
  },

  // Получение всех заметок
  async getNotes(): Promise<Note[]> {
    try {
      return await db.notes
        .orderBy('updatedAt')
        .reverse()
        .toArray();
    } catch (error) {
      throw new Error(`Ошибка получения заметок: ${error}`);
    }
  },

  // Получение заметки по ID
  async getNoteById(id: number): Promise<Note | undefined> {
    try {
      return await db.notes.get(id);
    } catch (error) {
      throw new Error(`Ошибка получения заметки: ${error}`);
    }
  },

  // Обновление заметки
  async updateNote(id: number, updates: NoteUpdate): Promise<void> {
    try {
      // Получаем существующую заметку
      const existingNote = await db.notes.get(id);
      if (!existingNote) {
        throw new Error('Заметка не найдена');
      }

      // Создаем объект для обновления
      const updateData: Partial<Note> = {};

      // Валидируем и обновляем поля
      if (updates.title !== undefined) {
        validation.validateTitle(updates.title);
        updateData.title = updates.title.trim();
      }

      if (updates.content !== undefined) {
        validation.validateContent(updates.content);
        updateData.content = updates.content.trim();
      }

      if (updates.tags !== undefined) {
        validation.validateTags(updates.tags);
        updateData.tags = updates.tags
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .map(tag => tag.toLowerCase());
      }

      // Обновляем заметку
      await db.notes.update(id, updateData);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Ошибка обновления заметки: ${error}`);
    }
  },

  // Удаление заметки
  async deleteNote(id: number): Promise<void> {
    try {
      const deletedCount = await db.notes.delete(id);
      if (deletedCount === 0) {
        throw new Error('Заметка не найдена');
      }
    } catch (error) {
      throw new Error(`Ошибка удаления заметки: ${error}`);
    }
  },

  // Поиск заметок
  async searchNotes(options: SearchOptions = {}): Promise<Note[]> {
    try {
      let collection = db.notes.orderBy('updatedAt').reverse();

      // Фильтрация по поисковому запросу
      if (options.query && options.query.trim().length > 0) {
        const query = options.query.toLowerCase().trim();
        collection = collection.filter(note => 
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        );
      }

      // Фильтрация по тегам
      if (options.tags && options.tags.length > 0) {
        const searchTags = options.tags.map(tag => tag.toLowerCase());
        collection = collection.filter(note =>
          searchTags.some(tag => note.tags.includes(tag))
        );
      }

      // Применяем лимит и смещение
      if (options.offset) {
        collection = collection.offset(options.offset);
      }

      if (options.limit) {
        collection = collection.limit(options.limit);
      }

      return await collection.toArray();
    } catch (error) {
      throw new Error(`Ошибка поиска заметок: ${error}`);
    }
  },

  // Получение всех уникальных тегов
  async getAllTags(): Promise<string[]> {
    try {
      const notes = await db.notes.toArray();
      const allTags = notes.flatMap(note => note.tags);
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.sort();
    } catch (error) {
      throw new Error(`Ошибка получения тегов: ${error}`);
    }
  },

  // Получение статистики
  async getStats(): Promise<{
    totalNotes: number;
    totalTags: number;
    averageNotesPerTag: number;
    lastUpdated: Date | null;
  }> {
    try {
      const notes = await db.notes.toArray();
      const totalNotes = notes.length;
      
      if (totalNotes === 0) {
        return {
          totalNotes: 0,
          totalTags: 0,
          averageNotesPerTag: 0,
          lastUpdated: null
        };
      }

      const allTags = notes.flatMap(note => note.tags);
      const uniqueTags = new Set(allTags);
      const totalTags = uniqueTags.size;
      
      const lastUpdated = notes.reduce((latest, note) => {
        return note.updatedAt > latest ? note.updatedAt : latest;
      }, notes[0].updatedAt);

      return {
        totalNotes,
        totalTags,
        averageNotesPerTag: totalTags > 0 ? totalNotes / totalTags : 0,
        lastUpdated
      };
    } catch (error) {
      throw new Error(`Ошибка получения статистики: ${error}`);
    }
  },

  // Очистка всех заметок (для разработки/тестирования)
  async clearAllNotes(): Promise<void> {
    try {
      await db.notes.clear();
    } catch (error) {
      throw new Error(`Ошибка очистки заметок: ${error}`);
    }
  },

  // Экспорт заметок в JSON
  async exportNotes(): Promise<string> {
    try {
      const notes = await db.notes.toArray();
      return JSON.stringify(notes, null, 2);
    } catch (error) {
      throw new Error(`Ошибка экспорта заметок: ${error}`);
    }
  },

  // Импорт заметок из JSON
  async importNotes(jsonData: string): Promise<number> {
    try {
      const notes: Note[] = JSON.parse(jsonData);
      
      // Валидируем каждую заметку
      for (const note of notes) {
        validation.validateNote({
          title: note.title,
          content: note.content,
          tags: note.tags
        });
      }

      // Очищаем существующие заметки
      await db.notes.clear();
      
      // Добавляем новые заметки
      await db.notes.bulkAdd(notes);
      
      return notes.length;
    } catch (error) {
      throw new Error(`Ошибка импорта заметок: ${error}`);
    }
  }
};

// Экспортируем все необходимое
export default {
  db,
  notesService,
  validation,
  ValidationError
};