<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { notesActions } from '$lib/stores';
	import type { Note } from '$lib/types';

	// Пропсы компонента
	export let placeholder = 'Поиск заметок...';
	export let debounceMs = 300;
	export let showResultsCount = true;
	export let autoFocus = false;

	// Локальные переменные
	let searchQuery = '';
	let searchResults: Note[] = [];
	let isSearching = false;
	let searchInputElement: HTMLInputElement;
	let debounceTimer: NodeJS.Timeout;

	// Event dispatcher для передачи результатов поиска
	const dispatch = createEventDispatcher<{
		search: { query: string; results: Note[] };
		clear: void;
	}>();

	// Автофокус при монтировании
	onMount(() => {
		if (autoFocus && searchInputElement) {
			searchInputElement.focus();
		}
	});

	// Функция дебаунса для оптимизации поиска
	function debounce(func: Function, delay: number) {
		return (...args: any[]) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => func.apply(null, args), delay);
		};
	}

	// Основная функция поиска
	async function performSearch(query: string) {
		if (!query.trim()) {
			searchResults = [];
			isSearching = false;
			dispatch('clear');
			return;
		}

		isSearching = true;
		
		try {
		// Используем метод поиска из notesActions
		const results = await notesActions.searchNotes(query.trim());
		
		searchResults = results;
		dispatch('search', { query: query.trim(), results });
	} catch (error) {
			console.error('Ошибка при поиске заметок:', error);
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	// Дебаунсированная функция поиска
	const debouncedSearch = debounce(performSearch, debounceMs);

	// Реактивный поиск при изменении запроса
	$: {
		debouncedSearch(searchQuery);
	}

	// Функция очистки поиска
	function clearSearch() {
		searchQuery = '';
		searchResults = [];
		isSearching = false;
		dispatch('clear');
		if (searchInputElement) {
			searchInputElement.focus();
		}
	}

	// Функция подсветки результатов поиска
	function highlightText(text: string, query: string): string {
		if (!query.trim()) return text;
		
		const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
		return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
	}

	// Функция для получения превью текста с подсветкой
	function getHighlightedPreview(note: Note, query: string, maxLength = 150): string {
		if (!query.trim()) return note.content.substring(0, maxLength) + (note.content.length > maxLength ? '...' : '');
		
		const lowerQuery = query.toLowerCase();
		const lowerContent = note.content.toLowerCase();
		const queryIndex = lowerContent.indexOf(lowerQuery);
		
		if (queryIndex === -1) {
			return highlightText(note.content.substring(0, maxLength), query) + (note.content.length > maxLength ? '...' : '');
		}
		
		// Показываем контекст вокруг найденного текста
		const start = Math.max(0, queryIndex - 50);
		const end = Math.min(note.content.length, queryIndex + query.length + 100);
		const preview = (start > 0 ? '...' : '') + 
						note.content.substring(start, end) + 
						(end < note.content.length ? '...' : '');
		
		return highlightText(preview, query);
	}

	// Обработчик нажатия клавиш
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			clearSearch();
		}
	}
</script>

<div class="search-bar">
	<!-- Поле поиска -->
	<div class="relative">
		<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
			{#if isSearching}
				<svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			{:else}
				<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
				</svg>
			{/if}
		</div>
		
		<input
			bind:this={searchInputElement}
			bind:value={searchQuery}
			on:keydown={handleKeydown}
			type="text"
			{placeholder}
			class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
			autocomplete="off"
			spellcheck="false"
		/>
		
		{#if searchQuery}
			<button
				on:click={clearSearch}
				class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
				title="Очистить поиск"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
				</svg>
			</button>
		{/if}
	</div>

	<!-- Счетчик результатов -->
	{#if showResultsCount && searchQuery}
		<div class="mt-2 text-sm text-gray-600">
			{#if isSearching}
				<span class="flex items-center">
					<svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Поиск...
				</span>
			{:else}
				<span>
					{#if searchResults.length === 0}
						Ничего не найдено для "{searchQuery}"
					{:else if searchResults.length === 1}
						Найдена 1 заметка
					{:else if searchResults.length < 5}
						Найдено {searchResults.length} заметки
					{:else}
						Найдено {searchResults.length} заметок
					{/if}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Превью результатов поиска -->
	{#if searchQuery && searchResults.length > 0 && !isSearching}
		<div class="mt-4 space-y-3 max-h-96 overflow-y-auto">
			<h4 class="text-sm font-medium text-gray-900 mb-2">Результаты поиска:</h4>
			{#each searchResults.slice(0, 5) as note (note.id)}
				<div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
					<h5 class="font-medium text-gray-900 mb-2">
						{@html highlightText(note.title, searchQuery)}
					</h5>
					<p class="text-sm text-gray-600 mb-2">
						{@html getHighlightedPreview(note, searchQuery)}
					</p>
					{#if note.tags.length > 0}
						<div class="flex flex-wrap gap-1">
							{#each note.tags.slice(0, 3) as tag}
								<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
									{@html highlightText(`#${tag}`, searchQuery)}
								</span>
							{/each}
							{#if note.tags.length > 3}
								<span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
									+{note.tags.length - 3}
								</span>
							{/if}
						</div>
					{/if}
					<div class="mt-2 text-xs text-gray-500">
						{new Intl.DateTimeFormat('ru-RU', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						}).format(new Date(note.createdAt))}
					</div>
				</div>
			{/each}
			{#if searchResults.length > 5}
				<div class="text-center text-sm text-gray-500 py-2">
					И еще {searchResults.length - 5} заметок...
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	/* Стили для подсветки поиска */
	:global(.search-bar mark) {
		background-color: #fef3c7;
		color: #92400e;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-weight: 500;
	}

	/* Анимация для результатов */
	.search-bar {
		animation: fadeIn 0.3s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>