/**
 * Конфигурация приложения
 */

export const APP_CONFIG = {
	// Лимиты для заметок
	NOTE_LIMITS: {
		TITLE_MAX_LENGTH: 100,
		CONTENT_MAX_LENGTH: 5000,
		TAG_MAX_LENGTH: 50,
		MAX_TAGS: 10
	},
	
	// Настройки поиска
	SEARCH: {
		MIN_QUERY_LENGTH: 2,
		DEBOUNCE_DELAY: 300 // мс
	},
	
	// Настройки UI
	UI: {
		NOTES_PER_PAGE: 20,
		ANIMATION_DURATION: 200,
		TOAST_DURATION: 3000
	},
	
	// Настройки базы данных
	DATABASE: {
		NAME: 'NotesApp',
		VERSION: 1,
		STORE_NAME: 'notes'
	}
} as const;

/**
 * Сообщения для пользователя
 */
export const MESSAGES = {
	SUCCESS: {
		NOTE_CREATED: 'Заметка успешно создана',
		NOTE_UPDATED: 'Заметка успешно обновлена',
		NOTE_DELETED: 'Заметка удалена'
	},
	
	ERROR: {
		GENERIC: 'Произошла ошибка. Попробуйте еще раз',
		NETWORK: 'Ошибка сети. Проверьте подключение',
		VALIDATION: 'Проверьте правильность заполнения полей',
		NOT_FOUND: 'Заметка не найдена'
	},
	
	CONFIRM: {
		DELETE_NOTE: 'Вы уверены, что хотите удалить эту заметку?',
		UNSAVED_CHANGES: 'У вас есть несохраненные изменения. Продолжить?'
	}
} as const;

/**
 * Ключи для localStorage
 */
export const STORAGE_KEYS = {
	SEARCH_HISTORY: 'notes_search_history',
	USER_PREFERENCES: 'notes_user_preferences',
	LAST_BACKUP: 'notes_last_backup'
} as const;