import Dexie, { type Table } from 'dexie';
import type { Note } from './types';

export class NotesDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('NotesDatabase');
    
    this.version(1).stores({
      notes: '&id, title, content, tags, createdAt, updatedAt'
    });
  }

  // Функция для очистки базы данных
  async clearDatabase() {
    console.log('🗑️ Очищаем базу данных...');
    try {
      await this.notes.clear();
      console.log('✅ База данных очищена');
    } catch (error) {
      console.error('❌ Ошибка при очистке базы данных:', error);
    }
  }

  // Функция для полного удаления базы данных
  async deleteDatabase() {
    console.log('💥 Удаляем базу данных полностью...');
    try {
      await this.delete();
      console.log('✅ База данных удалена');
    } catch (error) {
      console.error('❌ Ошибка при удалении базы данных:', error);
    }
  }
}

export const notesDB = new NotesDatabase();