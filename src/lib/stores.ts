import { writable } from 'svelte/store';
import type { Note, CreateNoteData } from './types';
import { notesDB } from './database';
import { toasts } from './stores/toasts';

// Основные сторы
export const notes = writable<Note[]>([]);
export const isLoading = writable<boolean>(false);
export const error = writable<string | null>(null);

// Функции для работы с заметками
export const notesActions = {
  // Загрузка всех заметок
  async loadNotes() {
    console.log('🔄 Начинаем загрузку заметок из IndexedDB...');
    isLoading.set(true);
    error.set(null);
    
    try {
      console.log('📊 Подключаемся к базе данных...');
      const allNotes = await notesDB.notes.orderBy('createdAt').reverse().toArray();
      console.log('✅ Загружено заметок:', allNotes.length, allNotes);
      notes.set(allNotes);
    } catch (err) {
      console.error('❌ Ошибка при загрузке заметок:', err);
      error.set('Не удалось загрузить заметки');
    } finally {
      isLoading.set(false);
      console.log('🏁 Загрузка заметок завершена');
    }
  },

  // Создание новой заметки
  async createNote(noteData: CreateNoteData) {
    console.log('📝 Создаем новую заметку:', noteData);
    isLoading.set(true);
    error.set(null);

    try {
      const now = new Date();
      const newNote: Note = {
        id: crypto.randomUUID(), // Генерируем уникальный ID
        ...noteData,
        createdAt: now,
        updatedAt: now
      };

      console.log('💾 Сохраняем заметку в IndexedDB:', newNote);
      await notesDB.notes.add(newNote);
      console.log('✅ Заметка успешно сохранена');
      
      // Обновляем стор
      notes.update(currentNotes => [newNote, ...currentNotes]);
      
      // Показываем уведомление об успехе
      toasts.add({
        message: 'Заметка успешно создана!',
        type: 'success'
      });
      
      return true;
    } catch (err) {
      console.error('❌ Ошибка при создании заметки:', err);
      const errorMessage = 'Не удалось создать заметку';
      error.set(errorMessage);
      
      // Показываем уведомление об ошибке
      toasts.add({
        message: errorMessage,
        type: 'error'
      });
      
      return false;
    } finally {
      isLoading.set(false);
    }
  },

  // Обновление заметки
  async updateNote(id: string, updates: Partial<CreateNoteData>) {
    isLoading.set(true);
    error.set(null);

    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await notesDB.notes.update(id, updateData);
      
      // Обновляем стор
      notes.update(currentNotes => 
        currentNotes.map(note => 
          note.id === id ? { ...note, ...updateData } : note
        )
      );
      
      // Показываем уведомление об успехе
      toasts.add({
        message: 'Заметка успешно обновлена!',
        type: 'success'
      });
    } catch (err) {
      console.error('Ошибка при обновлении заметки:', err);
      const errorMessage = 'Не удалось обновить заметку';
      error.set(errorMessage);
      
      // Показываем уведомление об ошибке
      toasts.add({
        message: errorMessage,
        type: 'error'
      });
      
      throw err;
    } finally {
      isLoading.set(false);
    }
  },

  // Удаление заметки
  async deleteNote(id: string) {
    isLoading.set(true);
    error.set(null);

    try {
      await notesDB.notes.delete(id);
      
      // Обновляем стор
      notes.update(currentNotes => 
        currentNotes.filter(note => note.id !== id)
      );
      
      // Показываем уведомление об успехе
      toasts.add({
        message: 'Заметка успешно удалена!',
        type: 'success'
      });
    } catch (err) {
      console.error('Ошибка при удалении заметки:', err);
      const errorMessage = 'Не удалось удалить заметку';
      error.set(errorMessage);
      
      // Показываем уведомление об ошибке
      toasts.add({
        message: errorMessage,
        type: 'error'
      });
      
      throw err;
    } finally {
      isLoading.set(false);
    }
  },

  // Получение заметки по ID
  async getNoteById(id: string): Promise<Note | undefined> {
    try {
      return await notesDB.notes.get(id);
    } catch (err) {
      console.error('Ошибка при получении заметки:', err);
      error.set('Не удалось получить заметку');
      return undefined;
    }
  },

  // Поиск заметок
  async searchNotes(query: string, tags: string[] = []): Promise<Note[]> {
    try {
      let result = await notesDB.notes.orderBy('createdAt').reverse().toArray();
      
      if (query) {
        const lowerQuery = query.toLowerCase();
        result = result.filter(note => 
          note.title.toLowerCase().includes(lowerQuery) ||
          note.content.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (tags.length > 0) {
        result = result.filter(note => 
          tags.some(tag => note.tags.includes(tag))
        );
      }
      
      return result;
    } catch (err) {
      console.error('Ошибка при поиске заметок:', err);
      error.set('Не удалось выполнить поиск');
      return [];
    }
  },

  // Получение всех тегов
  async getAllTags(): Promise<string[]> {
    try {
      const allNotes = await notesDB.notes.toArray();
      const tagsSet = new Set<string>();
      
      allNotes.forEach(note => {
        note.tags.forEach(tag => tagsSet.add(tag));
      });
      
      return Array.from(tagsSet).sort();
    } catch (err) {
      console.error('Ошибка при получении тегов:', err);
      return [];
    }
  }
};