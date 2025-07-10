<script lang="ts">
	import { onMount } from 'svelte';
	import { SearchBar, NotesList } from '$lib/components';
	import { notesActions } from '$lib/stores';
	import type { Note } from '$lib/types';

	let searchResults: Note[] = [];
	let isSearchActive = false;
	let searchQuery = '';

	// Загружаем заметки при монтировании
	onMount(() => {
		notesActions.loadNotes();
	});

	// Обработчик результатов поиска
	function handleSearch(event: CustomEvent<{ query: string; results: Note[] }>) {
		const { query, results } = event.detail;
		searchQuery = query;
		searchResults = results;
		isSearchActive = true;
	}

	// Обработчик очистки поиска
	function handleClear() {
		searchQuery = '';
		searchResults = [];
		isSearchActive = false;
	}
</script>

<svelte:head>
	<title>Поиск заметок - Notes App</title>
	<meta name="description" content="Поиск заметок в реальном времени" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Заголовок страницы -->
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">
				🔍 Поиск заметок
			</h1>
			<p class="text-gray-600">
				Найдите нужную заметку по заголовку, содержимому или тегам
			</p>
		</div>

		<!-- Навигация -->
		<div class="mb-8">
			<nav class="flex space-x-4 justify-center">
				<a 
					href="/" 
					class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
				>
					← Главная
				</a>
				<a 
					href="/notes" 
					class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
				>
					Все заметки
				</a>
				<a 
					href="/form" 
					class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
				>
					Создать заметку
				</a>
			</nav>
		</div>

		<!-- Компонент поиска -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<SearchBar
				placeholder="Введите запрос для поиска..."
				debounceMs={300}
				showResultsCount={true}
				autoFocus={true}
				on:search={handleSearch}
				on:clear={handleClear}
			/>
		</div>

		<!-- Результаты поиска или все заметки -->
		<div class="bg-white rounded-lg shadow-md p-6">
			{#if isSearchActive}
				<div class="mb-4">
					<h2 class="text-xl font-semibold text-gray-900 mb-2">
						Результаты поиска для "{searchQuery}"
					</h2>
					{#if searchResults.length === 0}
						<div class="text-center py-12">
							<div class="text-6xl mb-4">🔍</div>
							<h3 class="text-lg font-medium text-gray-900 mb-2">
								Ничего не найдено
							</h3>
							<p class="text-gray-600">
								Попробуйте изменить поисковый запрос или создайте новую заметку
							</p>
							<a 
								href="/form" 
								class="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Создать заметку
							</a>
						</div>
					{:else}
						<!-- Список найденных заметок -->
						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each searchResults as note (note.id)}
								<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
									<h3 class="font-medium text-gray-900 mb-2 line-clamp-2">
										{note.title}
									</h3>
									<p class="text-sm text-gray-600 mb-3 line-clamp-3">
										{note.content.substring(0, 150)}{note.content.length > 150 ? '...' : ''}
									</p>
									{#if note.tags.length > 0}
										<div class="flex flex-wrap gap-1 mb-3">
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
									<div class="text-xs text-gray-500">
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
						</div>
					{/if}
				</div>
			{:else}
				<div class="text-center py-12">
					<div class="text-6xl mb-4">🔍</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">
						Начните поиск
					</h2>
					<p class="text-gray-600 mb-4">
						Введите запрос в поле поиска выше, чтобы найти заметки
					</p>
					<div class="text-sm text-gray-500">
						<p class="mb-2">💡 <strong>Советы по поиску:</strong></p>
						<ul class="text-left inline-block space-y-1">
							<li>• Поиск работает по заголовку и содержимому</li>
							<li>• Можно искать по тегам</li>
							<li>• Поиск не чувствителен к регистру</li>
							<li>• Результаты обновляются в реальном времени</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>

		<!-- Дополнительная информация -->
		<div class="mt-8 text-center text-sm text-gray-500">
			<p>
				Поиск использует дебаунс 300мс для оптимизации производительности
			</p>
		</div>
	</div>
</div>

<style>
	/* Утилиты для ограничения строк */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>