<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Note, NoteCreate, NoteUpdate } from '$lib/types';
	import { validateNote } from '$lib/utils/validation';

	export let show = false;
	export let note: Note | null = null; // null для создания, объект для редактирования
	export let title = 'Создать заметку';

	const dispatch = createEventDispatcher<{
		save: NoteCreate | NoteUpdate;
		cancel: void;
	}>();

	let formTitle = '';
	let formContent = '';
	let formTags = '';
	let errors: Record<string, string> = {};
	let initialized = false;

	// Инициализация формы при открытии модального окна
	$: if (show && !initialized) {
		if (note) {
			formTitle = note.title;
			formContent = note.content;
			formTags = note.tags.join(', ');
			title = 'Редактировать заметку';
		} else {
			formTitle = '';
			formContent = '';
			formTags = '';
			title = 'Создать заметку';
		}
		initialized = true;
	}

	// Сброс флага инициализации при закрытии модального окна
	$: if (!show) {
		initialized = false;
	}

	// Реактивная валидация
	$: {
		errors = {};
		if (formTitle.trim()) {
			const titleValidation = validateNote({ title: formTitle.trim() });
			if (!titleValidation.isValid && titleValidation.errors.title) {
				errors.title = titleValidation.errors.title;
			}
		}
		if (formContent.trim()) {
			const contentValidation = validateNote({ content: formContent.trim() });
			if (!contentValidation.isValid && contentValidation.errors.content) {
				errors.content = contentValidation.errors.content;
			}
		}
	}

	function handleSave() {
		const trimmedTitle = formTitle.trim();
		const trimmedContent = formContent.trim();
		const parsedTags = formTags
			.split(',')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0);

		// Валидация
		const validation = validateNote({
			title: trimmedTitle,
			content: trimmedContent,
			tags: parsedTags
		});

		if (!validation.isValid) {
			errors = validation.errors;
			return;
		}

		if (note) {
			// Редактирование
			dispatch('save', {
				id: note.id,
				title: trimmedTitle,
				content: trimmedContent,
				tags: parsedTags
			} as NoteUpdate);
		} else {
			// Создание
			dispatch('save', {
				title: trimmedTitle,
				content: trimmedContent,
				tags: parsedTags
			} as NoteCreate);
		}

		handleCancel();
	}

	function handleCancel() {
		formTitle = '';
		formContent = '';
		formTags = '';
		errors = {};
		dispatch('cancel');
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			handleCancel();
		}
	}

	// Фокус на первое поле при открытии
	let titleInput: HTMLInputElement;
	$: if (show && titleInput) {
		setTimeout(() => titleInput.focus(), 100);
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
	<!-- Backdrop с эффектом размытия -->
	<div
		class="fixed inset-0 bg-arcane-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Modal с эффектами Аркейн -->
		<div
			class="modal-box bg-gradient-to-br from-arcane-dark-800/95 to-arcane-dark-900/95 backdrop-blur-xl border border-arcane-blue-500/30 shadow-2xl shadow-arcane-blue-500/20 max-w-2xl w-full mx-4 relative overflow-hidden"
			on:click|stopPropagation
		>
			<!-- Анимированный фон -->
			<div class="absolute inset-0 bg-gradient-to-r from-arcane-blue-500/5 to-arcane-pink-500/5 animate-shimmer"></div>
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-arcane-blue-500 via-arcane-pink-500 to-arcane-gold-500"></div>
			
			<!-- Header -->
			<div class="px-6 py-4 border-b border-arcane-blue-500/30 relative z-10">
				<h2 id="modal-title" class="text-xl font-semibold text-arcane-blue-100">
					{title}
				</h2>
			</div>

			<!-- Content -->
			<div class="px-6 py-4 max-h-[60vh] overflow-y-auto relative z-10">
				<form on:submit|preventDefault={handleSave} class="space-y-4">
					<!-- Title -->
					<div>
						<label for="title" class="block text-sm font-medium text-arcane-blue-200 mb-1">
							Заголовок
						</label>
						<input
							bind:this={titleInput}
							bind:value={formTitle}
							type="text"
							id="title"
							name="title"
							placeholder="Введите заголовок заметки..."
							class="input {errors.title ? 'border-arcane-red-500 focus:ring-arcane-red-500' : ''}"
							maxlength="100"
							required
						/>
						<div class="flex justify-between mt-1">
							{#if errors.title}
								<span class="text-sm text-arcane-red-400">{errors.title}</span>
							{:else}
								<span></span>
							{/if}
							<span class="text-sm text-arcane-blue-400">{formTitle.length}/100</span>
						</div>
					</div>

					<!-- Content -->
					<div>
						<label for="content" class="block text-sm font-medium text-arcane-blue-200 mb-1">
							Содержание
						</label>
						<textarea
							bind:value={formContent}
							id="content"
							name="content"
							placeholder="Введите содержание заметки..."
							rows="8"
							class="textarea {errors.content ? 'border-arcane-red-500 focus:ring-arcane-red-500' : ''}"
							maxlength="5000"
							required
						></textarea>
						<div class="flex justify-between mt-1">
							{#if errors.content}
								<span class="text-sm text-arcane-red-400">{errors.content}</span>
							{:else}
								<span></span>
							{/if}
							<span class="text-sm text-arcane-blue-400">{formContent.length}/5000</span>
						</div>
					</div>

					<!-- Tags -->
					<div>
						<label for="tags" class="block text-sm font-medium text-arcane-blue-200 mb-1">
							Теги (через запятую)
						</label>
						<input
							bind:value={formTags}
							type="text"
							id="tags"
							name="tags"
							placeholder="работа, идеи, важное..."
							class="input {errors.tags ? 'border-arcane-red-500 focus:ring-arcane-red-500' : ''}"
						/>
						{#if errors.tags}
							<span class="text-sm text-arcane-red-400 mt-1 block">{errors.tags}</span>
						{/if}
						{#if formTags.trim()}
							<div class="mt-2 flex flex-wrap gap-1">
								{#each formTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) as tag}
									<span class="inline-block bg-gradient-to-r from-arcane-blue-600/30 to-arcane-pink-600/30 text-arcane-blue-200 text-xs px-2 py-1 rounded border border-arcane-blue-500/30 backdrop-blur-sm">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</form>
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-arcane-blue-500/30 flex justify-end space-x-3 relative z-10">
				<button
					type="button"
					on:click={handleCancel}
					class="btn btn-secondary hover:scale-105 transition-transform duration-200"
				>
					Отменить
				</button>
				<button
					type="button"
					on:click={handleSave}
					disabled={!formTitle.trim() || !formContent.trim() || Object.keys(errors).length > 0}
					class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200 animate-glow-pulse"
				>
					{note ? 'Сохранить' : 'Создать'}
				</button>
			</div>
		</div>
	</div>
{/if}