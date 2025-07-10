/**
 * Утилиты для валидации данных заметок
 */

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
}

export const LIMITS = {
	TITLE_MAX_LENGTH: 100,
	CONTENT_MAX_LENGTH: 5000,
	TAG_MAX_LENGTH: 50,
	MAX_TAGS: 10
} as const;

/**
 * Валидация заголовка заметки
 */
export function validateTitle(title: string): ValidationResult {
	const errors: string[] = [];
	
	if (!title.trim()) {
		errors.push('Заголовок не может быть пустым');
	}
	
	if (title.length > LIMITS.TITLE_MAX_LENGTH) {
		errors.push(`Заголовок не может быть длиннее ${LIMITS.TITLE_MAX_LENGTH} символов`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Валидация содержания заметки
 */
export function validateContent(content: string): ValidationResult {
	const errors: string[] = [];
	
	if (!content.trim()) {
		errors.push('Содержание не может быть пустым');
	}
	
	if (content.length > LIMITS.CONTENT_MAX_LENGTH) {
		errors.push(`Содержание не может быть длиннее ${LIMITS.CONTENT_MAX_LENGTH} символов`);
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Валидация тегов
 */
export function validateTags(tagsString: string): ValidationResult {
	const errors: string[] = [];
	
	if (!tagsString.trim()) {
		return { isValid: true, errors: [] }; // Теги необязательны
	}
	
	const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
	
	if (tags.length > LIMITS.MAX_TAGS) {
		errors.push(`Максимальное количество тегов: ${LIMITS.MAX_TAGS}`);
	}
	
	for (const tag of tags) {
		if (tag.length > LIMITS.TAG_MAX_LENGTH) {
			errors.push(`Тег "${tag}" слишком длинный (максимум ${LIMITS.TAG_MAX_LENGTH} символов)`);
		}
		
		if (!/^[a-zA-Zа-яА-Я0-9\s\-_]+$/.test(tag)) {
			errors.push(`Тег "${tag}" содержит недопустимые символы`);
		}
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Полная валидация заметки
 */
export function validateNote(data: { title?: string; content?: string; tags?: string[] }): {
	isValid: boolean;
	errors: Record<string, string>;
} {
	const errors: Record<string, string> = {};
	
	if (data.title !== undefined) {
		const titleValidation = validateTitle(data.title);
		if (!titleValidation.isValid) {
			errors.title = titleValidation.errors[0];
		}
	}
	
	if (data.content !== undefined) {
		const contentValidation = validateContent(data.content);
		if (!contentValidation.isValid) {
			errors.content = contentValidation.errors[0];
		}
	}
	
	if (data.tags !== undefined) {
		const tagsString = Array.isArray(data.tags) ? data.tags.join(', ') : '';
		const tagsValidation = validateTags(tagsString);
		if (!tagsValidation.isValid) {
			errors.tags = tagsValidation.errors[0];
		}
	}
	
	return {
		isValid: Object.keys(errors).length === 0,
		errors
	};
}

/**
 * Очистка и нормализация тегов
 */
export function normalizeTags(tagsString: string): string[] {
	return tagsString
		.split(',')
		.map(tag => tag.trim().toLowerCase())
		.filter(tag => tag && tag.length > 0)
		.filter((tag, index, array) => array.indexOf(tag) === index); // Удаляем дубликаты
}