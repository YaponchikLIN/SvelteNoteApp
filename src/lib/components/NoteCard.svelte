<script lang="ts">
	import type { Note } from '$lib/types';
	
	export let note: Note;
	export let isEditing: boolean = false;
	export let editTitle: string = '';
	export let editContent: string = '';
	export let editTags: string = '';
	export let isLoading: boolean = false;
	export let onStartEdit: () => void;
	export let onSaveEdit: () => void;
	export let onCancelEdit: () => void;
	export let onDelete: () => void;
</script>

<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
	{#if isEditing}
		<!-- Режим редактирования -->
		<div class="space-y-4">
			<div>
				<input
					bind:value={editTitle}
					type="text"
					placeholder="Заголовок..."
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold"
					maxlength="100"
				/>
				<div class="text-xs text-gray-500 mt-1">{editTitle.length}/100 символов</div>
			</div>
			
			<div>
				<textarea
					bind:value={editContent}
					placeholder="Содержание..."
					rows="4"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
					maxlength="5000"
				></textarea>
				<div class="text-xs text-gray-500 mt-1">{editContent.length}/5000 символов</div>
			</div>
			
			<div>
				<input
					bind:value={editTags}
					type="text"
					placeholder="Теги через запятую..."
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
				/>
			</div>
			
			<div class="flex gap-2">
				<button
					on:click={onSaveEdit}
					disabled={!editTitle.trim() || !editContent.trim()}
					class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
				>
					Сохранить
				</button>
				<button
					on:click={onCancelEdit}
					class="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
				>
					Отмена
				</button>
			</div>
		</div>
	{:else}
		<!-- Режим просмотра -->
		<h3 class="font-semibold text-gray-900 text-lg mb-2">{note.title}</h3>
		<p class="text-gray-700 text-sm mb-4 whitespace-pre-wrap">{note.content}</p>
		
		{#if note.tags.length > 0}
			<div class="flex flex-wrap gap-1 mb-4">
				{#each note.tags as tag}
					<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
						#{tag}
					</span>
				{/each}
			</div>
		{/if}
		
		<div class="flex justify-between items-center">
			<span class="text-xs text-gray-500">
				{new Date(note.createdAt).toLocaleDateString('ru-RU')}
				{#if note.updatedAt && note.updatedAt.getTime() !== note.createdAt.getTime()}
					<br />Изменено: {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
				{/if}
			</span>
			<div class="flex gap-2">
				<button
					on:click={onStartEdit}
					disabled={isLoading}
					class="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
				>
					Изменить
				</button>
				<button
					on:click={onDelete}
					disabled={isLoading}
					class="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
				>
					Удалить
				</button>
			</div>
		</div>
	{/if}
</div>