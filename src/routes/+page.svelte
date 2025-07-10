<script lang="ts">
	import { onMount } from 'svelte';
	import { notes, isLoading, notesActions } from '$lib/stores';
	import { NoteModal, ConfirmModal } from '$lib/components';
	import type { Note, NoteCreate, NoteUpdate } from '$lib/types';

	// Состояние поиска и фильтрации
	let searchQuery = '';
	let selectedTags: string[] = [];

	// Состояние модальных окон
	let showCreateModal = false;
	let showEditModal = false;
	let showDeleteModal = false;
	let noteToEdit: Note | null = null;
	let noteToDelete: Note | null = null;

	// Загрузка заметок при монтировании компонента
	onMount(async () => {
		await notesActions.loadNotes();
	});

	// Реактивные вычисления для поиска и фильтрации
	$: allTags = [...new Set($notes.flatMap(note => note.tags))].sort();
	
	$: filteredNotes = $notes.filter(note => {
		const matchesSearch = !searchQuery || 
			note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			note.content.toLowerCase().includes(searchQuery.toLowerCase());
		
		const matchesTags = selectedTags.length === 0 || 
			selectedTags.every(tag => note.tags.includes(tag));
		
		return matchesSearch && matchesTags;
	});

	// Функции для работы с модальными окнами
	function openCreateModal() {
		showCreateModal = true;
	}

	function startEdit(note: Note) {
		noteToEdit = note;
		showEditModal = true;
	}

	function deleteNote(note: Note) {
		noteToDelete = note;
		showDeleteModal = true;
	}

	// Обработчики событий модальных окон
	async function handleCreateNote(event: CustomEvent<NoteCreate>) {
		await notesActions.createNote(event.detail);
		showCreateModal = false;
	}

	function handleCreateCancel() {
		showCreateModal = false;
	}

	async function handleEditNote(event: CustomEvent<NoteUpdate>) {
		if (noteToEdit && noteToEdit.id) {
			await notesActions.updateNote(noteToEdit.id, event.detail);
			showEditModal = false;
			noteToEdit = null;
		}
	}

	function handleEditCancel() {
		showEditModal = false;
		noteToEdit = null;
	}

	async function confirmDelete() {
		if (noteToDelete && noteToDelete.id) {
			await notesActions.deleteNote(noteToDelete.id);
			showDeleteModal = false;
			noteToDelete = null;
		}
	}

	function cancelDelete() {
		showDeleteModal = false;
		noteToDelete = null;
	}

	// Функции поиска и фильтрации
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}

	function clearSearch() {
		searchQuery = '';
		selectedTags = [];
	}
</script>

<svelte:head>
	<title>Заметки - SvelteKit App</title>
	<meta name="description" content="Приложение для создания и управления заметками" />
</svelte:head>

<div class="min-h-screen py-8 relative overflow-hidden">
	<!-- Фоновые эффекты в стиле Аркейн -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<!-- Анимированные частицы -->
		<div class="absolute top-10 left-10 w-2 h-2 bg-arcane-blue-400 rounded-full animate-float opacity-60"></div>
		<div class="absolute top-32 right-20 w-1 h-1 bg-arcane-gold-400 rounded-full animate-glow-pulse opacity-40"></div>
		<div class="absolute bottom-20 left-1/4 w-3 h-3 bg-arcane-pink-400 rounded-full animate-bounce opacity-30"></div>
		<div class="absolute top-1/2 right-10 w-2 h-2 bg-arcane-blue-300 rounded-full animate-pulse opacity-50"></div>
		<div class="absolute bottom-32 right-1/3 w-1 h-1 bg-arcane-gold-300 rounded-full animate-float opacity-60"></div>
		
		<!-- Градиентные линии -->
		<div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-arcane-blue-500/20 to-transparent"></div>
		<div class="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-arcane-pink-500/10 to-transparent"></div>
	</div>

	<div class="max-w-4xl mx-auto px-4 relative z-10">
		<h1 class="text-4xl font-bold bg-gradient-to-r from-arcane-blue-300 to-arcane-pink-300 bg-clip-text text-transparent mb-8 text-center">
			Мои заметки
		</h1>
		
		<!-- Кнопка создания заметки -->
		<div class="card mb-8">
			<div class="flex justify-between items-center relative z-10">
				<h2 class="text-xl font-semibold text-arcane-blue-100">Управление заметками</h2>
				<button
			on:click={openCreateModal}
			disabled={$isLoading}
			class="btn btn-primary bg-gradient-to-r from-arcane-blue-500 to-arcane-blue-600 hover:from-arcane-blue-600 hover:to-arcane-blue-700 text-white border-0 shadow-lg hover:shadow-arcane-blue-500/50 transition-all duration-300 animate-glow-pulse disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
			</svg>
			Создать заметку
		</button>
			</div>
		</div>
		
		<!-- Поиск -->
		<div class="card mb-8">
			<h2 class="text-xl font-semibold text-arcane-blue-100 mb-4 relative z-10">Поиск заметок</h2>
			
			<div class="space-y-4 relative z-10">
				<div>
					<label for="search" class="block text-sm font-medium text-arcane-blue-200 mb-2">
						Поиск по заголовку и содержанию
					</label>
					<div class="flex gap-2">
						<input
							id="search"
							bind:value={searchQuery}
							type="text"
							placeholder="Введите текст для поиска..."
							class="input flex-1"
						/>
						{#if searchQuery || selectedTags.length > 0}
							<button
								on:click={clearSearch}
								class="btn btn-secondary"
							>
								Очистить
							</button>
						{/if}
					</div>
				</div>
				
				{#if allTags.length > 0}
					<div>
						<label class="block text-sm font-medium text-arcane-blue-200 mb-2">
							Фильтр по тегам
						</label>
						<div class="flex flex-wrap gap-2">
							{#each allTags as tag}
								<button
									on:click={() => toggleTag(tag)}
									class="px-3 py-1 rounded-full text-sm transition-all duration-300 transform hover:scale-105 {selectedTags.includes(tag) 
										? 'bg-gradient-to-r from-arcane-pink-500 to-arcane-pink-600 text-white shadow-lg shadow-arcane-pink-500/30' 
										: 'bg-arcane-dark-700/50 text-arcane-blue-200 hover:bg-arcane-dark-600/50 border border-arcane-blue-500/30'}"
								>
									#{tag}
								</button>
							{/each}
						</div>
					</div>
				{/if}
				
				{#if searchQuery || selectedTags.length > 0}
					<div class="text-sm text-arcane-blue-300">
						Найдено заметок: <span class="text-arcane-gold-400 font-semibold">{filteredNotes.length}</span>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Список заметок -->
		{#if $isLoading}
			<div class="text-center py-12">
				<div class="relative">
					<svg class="animate-spin mx-auto h-12 w-12 text-arcane-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<div class="absolute inset-0 animate-ping">
						<div class="w-12 h-12 mx-auto rounded-full bg-arcane-blue-500/20"></div>
					</div>
				</div>
				<p class="mt-4 text-arcane-blue-200">Загрузка заметок...</p>
			</div>
		{:else if (searchQuery || selectedTags.length > 0 ? filteredNotes : $notes).length === 0}
			<div class="text-center py-12">
				<div class="text-arcane-blue-400/50 mb-4">
					<svg class="mx-auto h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
						<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
					</svg>
				</div>
				{#if searchQuery || selectedTags.length > 0}
					<h3 class="text-xl font-medium text-arcane-blue-100 mb-2">Ничего не найдено</h3>
					<p class="text-arcane-blue-300">Попробуйте изменить критерии поиска</p>
				{:else}
					<h3 class="text-xl font-medium text-arcane-blue-100 mb-2">Пока нет заметок</h3>
					<p class="text-arcane-blue-300">Создайте свою первую заметку, чтобы начать</p>
				{/if}
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each (searchQuery || selectedTags.length > 0 ? filteredNotes : $notes) as note (note.id)}
					<div class="card hover:shadow-2xl hover:shadow-arcane-blue-500/20 transition-all duration-300 transform hover:scale-105 group hover:border-arcane-blue-400/50">
						<!-- Эффект свечения при наведении -->
						<div class="absolute inset-0 bg-gradient-to-r from-arcane-blue-500/10 to-arcane-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						
						<!-- Режим просмотра -->
						<div class="relative z-10">
							<h3 class="font-semibold text-arcane-blue-100 text-lg mb-2 group-hover:text-arcane-gold-300 transition-colors duration-300">
								{note.title}
							</h3>
							<p class="text-arcane-blue-200 text-sm mb-4 whitespace-pre-wrap leading-relaxed group-hover:text-arcane-blue-100 transition-colors duration-300">
								{note.content}
							</p>
							
							{#if note.tags.length > 0}
								<div class="flex flex-wrap gap-1 mb-4">
									{#each note.tags as tag}
										<span class="inline-block bg-gradient-to-r from-arcane-blue-600/30 to-arcane-pink-600/30 text-arcane-blue-200 text-xs px-2 py-1 rounded-full border border-arcane-blue-500/30 backdrop-blur-sm hover:border-arcane-blue-400/50 transition-colors duration-200">
											#{tag}
										</span>
									{/each}
								</div>
							{/if}
							
							<div class="flex justify-between items-center">
								<span class="text-xs text-arcane-blue-400">
									{new Date(note.createdAt).toLocaleDateString('ru-RU')}
									{#if note.updatedAt && note.updatedAt.getTime() !== note.createdAt.getTime()}
										<br /><span class="text-arcane-gold-400">Изменено:</span> {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
									{/if}
								</span>
								<div class="flex gap-2">
									<button
										on:click={() => startEdit(note)}
										disabled={$isLoading}
										class="p-2 text-arcane-gold-400 hover:text-arcane-gold-300 hover:bg-arcane-gold-500/20 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
										title="Редактировать"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
										</svg>
									</button>
									<button
										on:click={() => deleteNote(note)}
										disabled={$isLoading}
										class="p-2 text-arcane-pink-400 hover:text-arcane-pink-300 hover:bg-arcane-pink-500/20 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
										title="Удалить"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Модальное окно создания заметки -->
<NoteModal
	bind:show={showCreateModal}
	title="Создать новую заметку"
	on:save={handleCreateNote}
	on:cancel={handleCreateCancel}
/>

<!-- Модальное окно редактирования заметки -->
<NoteModal
	bind:show={showEditModal}
	title="Редактировать заметку"
	note={noteToEdit}
	on:save={handleEditNote}
	on:cancel={handleEditCancel}
/>

<!-- Модальное окно подтверждения удаления -->
<ConfirmModal
	bind:isOpen={showDeleteModal}
	title="Удаление заметки"
	message="Вы уверены, что хотите удалить заметку «{noteToDelete?.title}»? Это действие нельзя отменить."
	confirmText="Удалить"
	cancelText="Отмена"
	confirmType="danger"
	on:confirm={confirmDelete}
	on:cancel={cancelDelete}
/>
