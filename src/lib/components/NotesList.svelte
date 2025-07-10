<script lang="ts">
	import { onMount } from 'svelte';
	import { notes, notesActions, isLoading } from '$lib/stores';
	import type { Note } from '$lib/types';

	// Пропсы компонента
	export let searchQuery = '';
	export let selectedTags: string[] = [];
	export let showActions = true;

	// Локальные переменные
	let filteredNotes: Note[] = [];
	let isDeleting: { [key: number]: boolean } = {};

	// Подписка на изменения заметок и фильтрация
	$: {
		filteredNotes = $notes.filter(note => {
			// Фильтр по поисковому запросу
			const matchesSearch = !searchQuery || 
				note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				note.content.toLowerCase().includes(searchQuery.toLowerCase());

			// Фильтр по тегам
			const matchesTags = selectedTags.length === 0 || 
				selectedTags.some(tag => note.tags.includes(tag));

			return matchesSearch && matchesTags;
		});
	}

	// Загрузка заметок при монтировании компонента
	onMount(async () => {
		await notesActions.loadNotes();
	});

	// Функция для получения превью текста
	function getPreview(content: string, maxLength = 100): string {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength).trim() + '...';
	}

	// Функция для форматирования даты
	function formatDate(date: Date): string {
		return new Intl.DateTimeFormat('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(date));
	}

	// Функция удаления заметки
	async function handleDelete(noteId: number) {
		if (!confirm('Вы уверены, что хотите удалить эту заметку?')) return;
		
		isDeleting[noteId] = true;
		try {
			await notesActions.deleteNote(noteId);
		} catch (error) {
			console.error('Ошибка при удалении заметки:', error);
		} finally {
			isDeleting[noteId] = false;
		}
	}

	// Функция для просмотра заметки (можно расширить)
	function handleView(note: Note) {
		// Здесь можно добавить логику для открытия модального окна или перехода на страницу заметки
		console.log('Просмотр заметки:', note);
	}

	// Функция для редактирования заметки (можно расширить)
	function handleEdit(note: Note) {
		// Здесь можно добавить логику для редактирования
		console.log('Редактирование заметки:', note);
	}
</script>

<div class="notes-list">
	<!-- Загрузочное состояние -->
	{#if $isLoading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			<span class="ml-3 text-gray-600">Загрузка заметок...</span>
		</div>
	
	<!-- Пустое состояние -->
	{:else if filteredNotes.length === 0}
		<div class="text-center py-12">
			<div class="mx-auto w-24 h-24 mb-4 text-gray-300">
				<svg fill="currentColor" viewBox="0 0 24 24">
					<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
				</svg>
			</div>
			<h3 class="text-xl font-medium text-gray-900 mb-2">
				{#if searchQuery || selectedTags.length > 0}
					Заметки не найдены
				{:else}
					Пока нет заметок
				{/if}
			</h3>
			<p class="text-gray-500 mb-6">
				{#if searchQuery || selectedTags.length > 0}
					Попробуйте изменить критерии поиска
				{:else}
					Создайте свою первую заметку, чтобы начать
				{/if}
			</p>
			{#if !searchQuery && selectedTags.length === 0}
				<button 
					class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
					on:click={() => window.location.href = '/form'}
				>
					Создать заметку
				</button>
			{/if}
		</div>

	<!-- Список заметок -->
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each filteredNotes as note (note.id)}
				<div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 overflow-hidden">
					<!-- Заголовок заметки -->
					<div class="p-4 border-b border-gray-100">
						<h3 class="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
							{note.title}
						</h3>
						<p class="text-sm text-gray-500">
							{formatDate(note.createdAt)}
						</p>
					</div>

					<!-- Содержимое заметки -->
					<div class="p-4">
						<p class="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
							{getPreview(note.content)}
						</p>

						<!-- Теги -->
						{#if note.tags.length > 0}
							<div class="flex flex-wrap gap-1 mb-4">
								{#each note.tags.slice(0, 3) as tag}
									<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
										#{tag}
									</span>
								{/each}
								{#if note.tags.length > 3}
									<span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
										+{note.tags.length - 3}
									</span>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Кнопки действий -->
					{#if showActions}
						<div class="px-4 pb-4 flex justify-between items-center">
							<div class="flex space-x-2">
								<button
									class="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
									on:click={() => handleView(note)}
									title="Просмотреть заметку"
								>
									<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
										<path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
									</svg>
									Просмотр
								</button>
								
								<button
									class="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
									on:click={() => handleEdit(note)}
									title="Редактировать заметку"
								>
									<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
									</svg>
									Изменить
								</button>
							</div>

							<button
								class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
								on:click={() => note.id && handleDelete(note.id)}
								disabled={note.id && isDeleting[note.id]}
								title="Удалить заметку"
							>
								{#if note.id && isDeleting[note.id]}
									<svg class="w-4 h-4 inline animate-spin" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
									</svg>
								{:else}
									<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
									</svg>
								{/if}
								Удалить
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Информация о количестве заметок -->
		<div class="mt-6 text-center text-sm text-gray-500">
			{#if searchQuery || selectedTags.length > 0}
				Найдено заметок: {filteredNotes.length}
			{:else}
				Всего заметок: {filteredNotes.length}
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Ограничение количества строк для текста */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>