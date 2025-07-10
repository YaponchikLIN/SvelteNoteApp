import { writable, derived, type Writable } from 'svelte/store';
import { APP_CONFIG } from '$lib/config/constants';

/**
 * Хук для debounced поиска
 */
export function createDebouncedSearch(delay: number = APP_CONFIG.SEARCH.DEBOUNCE_DELAY) {
	const searchQuery = writable('');
	const debouncedQuery = writable('');
	
	let timeoutId: NodeJS.Timeout;
	
	searchQuery.subscribe(value => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			debouncedQuery.set(value);
		}, delay);
	});
	
	return {
		searchQuery,
		debouncedQuery,
		setQuery: (query: string) => searchQuery.set(query),
		clearQuery: () => searchQuery.set('')
	};
}

/**
 * Хук для управления состоянием формы
 */
export function createFormState<T extends Record<string, any>>(initialValues: T) {
	const values = writable<T>(initialValues);
	const errors = writable<Partial<Record<keyof T, string>>>({});
	const touched = writable<Partial<Record<keyof T, boolean>>>({});
	const isSubmitting = writable(false);
	
	const isValid = derived([values, errors], ([$values, $errors]) => {
		return Object.keys($errors).length === 0;
	});
	
	const isDirty = derived([values], ([$values]) => {
		return JSON.stringify($values) !== JSON.stringify(initialValues);
	});
	
	return {
		values,
		errors,
		touched,
		isSubmitting,
		isValid,
		isDirty,
		
		setField: (field: keyof T, value: any) => {
			values.update(v => ({ ...v, [field]: value }));
			touched.update(t => ({ ...t, [field]: true }));
		},
		
		setError: (field: keyof T, error: string) => {
			errors.update(e => ({ ...e, [field]: error }));
		},
		
		clearError: (field: keyof T) => {
			errors.update(e => {
				const newErrors = { ...e };
				delete newErrors[field];
				return newErrors;
			});
		},
		
		reset: () => {
			values.set(initialValues);
			errors.set({});
			touched.set({});
			isSubmitting.set(false);
		}
	};
}

/**
 * Хук для управления модальными окнами
 */
export function createModal() {
	const isOpen = writable(false);
	const data = writable<any>(null);
	
	return {
		isOpen,
		data,
		open: (modalData?: any) => {
			data.set(modalData);
			isOpen.set(true);
		},
		close: () => {
			isOpen.set(false);
			data.set(null);
		}
	};
}

/**
 * Хук для уведомлений (toast)
 */
export function createToast() {
	interface Toast {
		id: string;
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
		duration?: number;
	}
	
	const toasts = writable<Toast[]>([]);
	
	const addToast = (message: string, type: Toast['type'] = 'info', duration = APP_CONFIG.UI.TOAST_DURATION) => {
		const id = Math.random().toString(36).substr(2, 9);
		const toast: Toast = { id, message, type, duration };
		
		toasts.update(list => [...list, toast]);
		
		if (duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, duration);
		}
		
		return id;
	};
	
	const removeToast = (id: string) => {
		toasts.update(list => list.filter(toast => toast.id !== id));
	};
	
	return {
		toasts,
		addToast,
		removeToast,
		success: (message: string) => addToast(message, 'success'),
		error: (message: string) => addToast(message, 'error'),
		warning: (message: string) => addToast(message, 'warning'),
		info: (message: string) => addToast(message, 'info')
	};
}