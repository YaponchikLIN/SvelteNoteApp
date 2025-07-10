<script lang="ts">
	export let searchQuery: string = '';
	export let selectedTags: string[] = [];
	export let allTags: string[] = [];
	export let filteredCount: number = 0;
	export let onToggleTag: (tag: string) => void;
	export let onClearSearch: () => void;
</script>

<div class="bg-white rounded-lg shadow-md p-6 mb-8">
	<h2 class="text-xl font-semibold text-gray-900 mb-4">Поиск заметок</h2>
	
	<div class="space-y-4">
		<div>
			<label for="search" class="block text-sm font-medium text-gray-700 mb-2">
				Поиск по заголовку и содержанию
			</label>
			<div class="flex gap-2">
				<input
					id="search"
					bind:value={searchQuery}
					type="text"
					placeholder="Введите текст для поиска..."
					class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				{#if searchQuery || selectedTags.length > 0}
					<button
						on:click={onClearSearch}
						class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
					>
						Очистить
					</button>
				{/if}
			</div>
		</div>
		
		{#if allTags.length > 0}
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Фильтр по тегам
				</label>
				<div class="flex flex-wrap gap-2">
					{#each allTags as tag}
						<button
							on:click={() => onToggleTag(tag)}
							class="px-3 py-1 rounded-full text-sm transition-colors {selectedTags.includes(tag) 
								? 'bg-blue-600 text-white' 
								: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
						>
							#{tag}
						</button>
					{/each}
				</div>
			</div>
		{/if}
		
		{#if searchQuery || selectedTags.length > 0}
			<div class="text-sm text-gray-600">
				Найдено заметок: {filteredCount}
			</div>
		{/if}
	</div>
</div>