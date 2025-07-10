import { describe, it, expect } from 'vitest';
import { validateTitle, validateContent, validateTags, validateNote, normalizeTags } from '$lib/utils/validation';

describe('Validation Utils', () => {
	describe('validateTitle', () => {
		it('should pass for valid title', () => {
			const result = validateTitle('Валидный заголовок');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail for empty title', () => {
			const result = validateTitle('');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Заголовок не может быть пустым');
		});

		it('should fail for title that is too long', () => {
			const longTitle = 'a'.repeat(101);
			const result = validateTitle(longTitle);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Заголовок не может быть длиннее 100 символов');
		});
	});

	describe('validateContent', () => {
		it('should pass for valid content', () => {
			const result = validateContent('Валидное содержание');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail for empty content', () => {
			const result = validateContent('');
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Содержание не может быть пустым');
		});

		it('should fail for content that is too long', () => {
			const longContent = 'a'.repeat(5001);
			const result = validateContent(longContent);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Содержание не может быть длиннее 5000 символов');
		});
	});

	describe('validateTags', () => {
		it('should pass for valid tags', () => {
			const result = validateTags('работа, идеи, важное');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should pass for empty tags', () => {
			const result = validateTags('');
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail for too many tags', () => {
			const manyTags = Array(11).fill('тег').join(', ');
			const result = validateTags(manyTags);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain('Максимальное количество тегов: 10');
		});

		it('should fail for tags that are too long', () => {
			const longTag = 'a'.repeat(51);
			const result = validateTags(longTag);
			expect(result.isValid).toBe(false);
			expect(result.errors[0]).toContain('слишком длинный');
		});
	});

	describe('normalizeTags', () => {
		it('should normalize tags correctly', () => {
			const result = normalizeTags('Работа, ИДЕИ,  важное , работа');
			expect(result).toEqual(['работа', 'идеи', 'важное']);
		});

		it('should remove empty tags', () => {
			const result = normalizeTags('работа, , идеи,  ,важное');
			expect(result).toEqual(['работа', 'идеи', 'важное']);
		});

		it('should handle empty input', () => {
			const result = normalizeTags('');
			expect(result).toEqual([]);
		});
	});
});