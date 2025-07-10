import { writable, derived } from 'svelte/store';
import type { Note, NoteCreate, NoteUpdate, SearchFilters, NotificationMessage } from '../types';
import { notesService } from '../db/database';

// Основные stores
export const notes = writable<Note[]>([]);
export const searchQuery = writable<string>('');
export const searchFilters = writable<SearchFilters>({
  tags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc'
});
export const selectedTags = writable<string[]>([]);
export const availableTags = writable<string[]>([]);
export const notifications = writable<NotificationMessage[]>([]);
export const isLoading = writable<boolean>(false);

// Derived store для фильтрованных заметок
export const filteredNotes = derived(
  [notes, searchQuery, selectedTags],
  ([$notes, $searchQuery, $selectedTags]) => {
    let filtered = $notes;

    // Фильтрация по поисковому запросу
    if ($searchQuery.trim()) {
      const query = $searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Фильтрация по выбранным тегам
    if ($selectedTags.length > 0) {
      filtered = filtered.filter(note =>
        $selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  }
);

// Actions для работы с заметками
export const notesActions = {
  // Загрузка всех заметок
  async loadNotes() {
    try {
      isLoading.set(true);
      const allNotes = await notesService.getNotes();
      notes.set(allNotes);
      
      // Обновляем доступные теги
      const tags = await notesService.getAllTags();
      availableTags.set(tags);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
      this.addNotification('Ошибка загрузки заметок', 'error');
    } finally {
      isLoading.set(false);
    }
  },

  // Создание новой заметки
  async createNote(noteData: NoteCreate) {
    try {
      isLoading.set(true);
      const id = await notesService.createNote(noteData);
      await this.loadNotes(); // Перезагружаем список
      this.addNotification('Заметка создана', 'success');
      return id;
    } catch (error) {
      console.error('Ошибка создания заметки:', error);
      this.addNotification('Ошибка создания заметки', 'error');
      throw error;
    } finally {
      isLoading.set(false);
    }
  },

  // Обновление заметки
  async updateNote(id: number, updates: NoteUpdate) {
    try {
      isLoading.set(true);
      await notesService.updateNote(id, updates);
      await this.loadNotes(); // Перезагружаем список
      this.addNotification('Заметка обновлена', 'success');
    } catch (error) {
      console.error('Ошибка обновления заметки:', error);
      this.addNotification('Ошибка обновления заметки', 'error');
      throw error;
    } finally {
      isLoading.set(false);
    }
  },

  // Удаление заметки
  async deleteNote(id: number) {
    try {
      isLoading.set(true);
      await notesService.deleteNote(id);
      await this.loadNotes(); // Перезагружаем список
      this.addNotification('Заметка удалена', 'success');
    } catch (error) {
      console.error('Ошибка удаления заметки:', error);
      this.addNotification('Ошибка удаления заметки', 'error');
      throw error;
    } finally {
      isLoading.set(false);
    }
  },

  // Поиск заметок
  async searchNotes(options: { 
    query: string; 
    searchInContent?: boolean; 
    searchInTags?: boolean;
    tags?: string[];
    limit?: number;
  }) {
    try {
      const searchOptions = {
        query: options.query,
        tags: options.tags,
        limit: options.limit
      };
      
      const results = await notesService.searchNotes(searchOptions);
      return results;
    } catch (error) {
      console.error('Ошибка поиска заметок:', error);
      this.addNotification('Ошибка поиска заметок', 'error');
      return [];
    }
  },

  // Добавление уведомления
  addNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };

    notifications.update(current => [...current, notification]);

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  },

  // Удаление уведомления
  removeNotification(id: string) {
    notifications.update(current => current.filter(n => n.id !== id));
  }
};