import { writable } from 'svelte/store';

export interface ToastMessage {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	const store = {
		subscribe,
		add: (toast: Omit<ToastMessage, 'id'>) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: ToastMessage = {
				id,
				duration: 3000,
				...toast
			};
			
			update(toasts => [...toasts, newToast]);
			
			// Автоматическое удаление через duration
			if (newToast.duration && newToast.duration > 0) {
				setTimeout(() => {
					update(toasts => toasts.filter(t => t.id !== id));
				}, newToast.duration + 300); // +300ms для анимации
			}
			
			return id;
		},
		remove: (id: string) => {
			update(toasts => toasts.filter(t => t.id !== id));
		},
		clear: () => {
			update(() => []);
		}
	};

	// Добавляем удобные методы для разных типов уведомлений
	return {
		...store,
		success: (message: string, duration?: number) => {
			return store.add({ message, type: 'success', duration });
		},
		error: (message: string, duration?: number) => {
			return store.add({ message, type: 'error', duration });
		},
		warning: (message: string, duration?: number) => {
			return store.add({ message, type: 'warning', duration });
		},
		info: (message: string, duration?: number) => {
			return store.add({ message, type: 'info', duration });
		}
	};
}

export const toasts = createToastStore();