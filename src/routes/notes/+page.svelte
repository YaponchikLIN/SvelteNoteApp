<script lang="ts">
	import { NotesList, NoteForm } from '$lib/components';
	import { notes, notesActions } from '$lib/stores';
	import { onMount } from 'svelte';

	// Состояние для поиска и фильтрации
	let searchQuery = '';
	let selectedTags: string[] = [];
	let showForm = false;
	let availableTags: string[] = [];

	// Загрузка доступных тегов
	onMount(async () => {
		await notesActions.loadNotes();
		availableTags = await notesActions.getAllTags();
	});

	// Обновление доступных тегов при изменении заметок
	$: if ($notes.length > 0) {
		updateAvailableTags();
	}

	async function updateAvailableTags() {
		availableTags = await notesActions.getAllTags();
	}

	// Функция для переключения тега в фильтре
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	// Очистка фильтров
	function clearFilters() {
		searchQuery = '';
		selectedTags = [];
	}

	// Обработчик создания заметки
	function handleNoteCreated() {
		showForm = false;
		updateAvailableTags();
	}
</script>

<svelte:head>
	<title>Список заметок - Notes App</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Заголовок страницы -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-2">Мои заметки</h1>
			<p class="text-gray-600">Управляйте своими заметками: создавайте, редактируйте, ищите и организуйте</p>
		</div>

		<!-- Панель управления -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<!-- Поиск -->
				<div class="flex-1 max-w-md">
					<label for="search" class="block text-sm font-medium text-gray-700 mb-2">
						Поиск заметок
					</label>
					<div class="relative">
						<input
							id="search"
							type="text"
							bind:value={searchQuery}
							placeholder="Поиск по заголовку или содержимому..."
							class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
						<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
							</svg>
						</div>
					</div>
				</div>

				<!-- Кнопки действий -->
				<div class="flex gap-3">
					<button
						on:click={() => showForm = !showForm}
						class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
						</svg>
						{showForm ? 'Скрыть форму' : 'Создать заметку'}
					</button>

					{#if searchQuery || selectedTags.length > 0}
						<button
							on:click={clearFilters}
							class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
						>
							Очистить фильтры
						</button>
					{/if}
				</div>
			</div>

			<!-- Фильтр по тегам -->
			{#if availableTags.length > 0}
				<div class="mt-6">
					<label class="block text-sm font-medium text-gray-700 mb-3">
						Фильтр по тегам
					</label>
					<div class="flex flex-wrap gap-2">
						{#each availableTags as tag}
							<button
								on:click={() => toggleTag(tag)}
								class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors {
									selectedTags.includes(tag)
										? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
										: 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
								}"
							>
								#{tag}
								{#if selectedTags.includes(tag)}
									<svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
									</svg>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Активные фильтры -->
			{#if searchQuery || selectedTags.length > 0}
				<div class="mt-4 p-3 bg-blue-50 rounded-lg">
					<div class="flex items-center gap-2 text-sm text-blue-800">
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/>
						</svg>
						<span class="font-medium">Активные фильтры:</span>
						{#if searchQuery}
							<span class="bg-white px-2 py-1 rounded">Поиск: "{searchQuery}"</span>
						{/if}
						{#if selectedTags.length > 0}
							<span class="bg-white px-2 py-1 rounded">Теги: {selectedTags.join(', ')}</span>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- Форма создания заметки -->
		{#if showForm}
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Создать новую заметку</h2>
				<NoteForm on:noteCreated={handleNoteCreated} />
			</div>
		{/if}

		<!-- Список заметок -->
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			<NotesList 
				{searchQuery} 
				{selectedTags}
				showActions={true}
			/>
		</div>

		<!-- Статистика -->
		<div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
				<div class="text-3xl font-bold text-blue-600 mb-2">{$notes.length}</div>
				<div class="text-gray-600">Всего заметок</div>
			</div>
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
				<div class="text-3xl font-bold text-green-600 mb-2">{availableTags.length}</div>
				<div class="text-gray-600">Уникальных тегов</div>
			</div>
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
				<div class="text-3xl font-bold text-purple-600 mb-2">
					{$notes.filter(note => {
						const today = new Date();
						const noteDate = new Date(note.createdAt);
						return noteDate.toDateString() === today.toDateString();
					}).length}
				</div>
				<div class="text-gray-600">Создано сегодня</div>
			</div>
		</div>

		<!-- Навигация -->
		<div class="mt-8 text-center">
			<a 
				href="/" 
				class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
				</svg>
				Вернуться на главную
			</a>
		</div>
	</div>
</div>