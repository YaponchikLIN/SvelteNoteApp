<script lang="ts">
  import { onMount } from 'svelte';
  import NoteForm from '$lib/components/NoteForm.svelte';
  import { notes, notesActions } from '$lib/stores';
  import type { NoteCreate } from '$lib/types';

  let showForm = true;
  let lastCreatedNote: { note: NoteCreate; id: number } | null = null;

  onMount(async () => {
    // Загружаем заметки при монтировании компонента
    await notesActions.loadNotes();
  });

  function handleNoteCreated(event: CustomEvent<{ note: NoteCreate; id: number }>) {
    lastCreatedNote = event.detail;
    showForm = false;
    
    // Показываем форму снова через 3 секунды для удобства тестирования
    setTimeout(() => {
      showForm = true;
    }, 3000);
  }

  function handleCancel() {
    showForm = false;
    setTimeout(() => {
      showForm = true;
    }, 1000);
  }

  function showFormAgain() {
    showForm = true;
    lastCreatedNote = null;
  }
</script>

<svelte:head>
  <title>Форма создания заметки - Тест</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="container mx-auto px-4 max-w-2xl">
    <!-- Заголовок страницы -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">🎨 Тест компонента формы</h1>
      <p class="text-gray-600">Демонстрация NoteForm.svelte с валидацией и современным дизайном</p>
    </div>

    <!-- Навигация -->
    <div class="mb-6">
      <nav class="flex space-x-4">
        <a 
          href="/" 
          class="text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          ← Главная
        </a>
        <a 
          href="/test" 
          class="text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          База данных
        </a>
      </nav>
    </div>

    <!-- Статистика -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600">{$notes.length}</div>
            <div class="text-sm text-gray-500">Заметок</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {lastCreatedNote ? '✓' : '○'}
            </div>
            <div class="text-sm text-gray-500">Создано</div>
          </div>
        </div>
        <button
          on:click={showFormAgain}
          class="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
        >
          Показать форму
        </button>
      </div>
    </div>

    <!-- Компонент формы -->
    {#if showForm}
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 fade-in">
        <NoteForm 
          on:noteCreated={handleNoteCreated}
          on:cancel={handleCancel}
        />
      </div>
    {:else}
      <!-- Сообщение об успешном создании -->
      <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 fade-in">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-green-800">Заметка успешно создана!</h3>
            <p class="text-green-700">Форма будет показана снова через несколько секунд</p>
          </div>
        </div>

        {#if lastCreatedNote}
          <div class="bg-white rounded-lg p-4 border border-green-200">
            <h4 class="font-semibold text-gray-800 mb-2">{lastCreatedNote.note.title}</h4>
            <p class="text-gray-600 text-sm mb-2">{lastCreatedNote.note.content}</p>
            {#if lastCreatedNote.note.tags.length > 0}
              <div class="flex flex-wrap gap-1">
                {#each lastCreatedNote.note.tags as tag}
                  <span class="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <button
          on:click={showFormAgain}
          class="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Создать еще одну заметку
        </button>
      </div>
    {/if}

    <!-- Список последних заметок -->
    {#if $notes.length > 0}
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Последние заметки ({$notes.length})</h2>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          {#each $notes.slice(0, 5) as note (note.id)}
            <div class="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <h3 class="font-medium text-gray-800 mb-1">{note.title}</h3>
              <p class="text-gray-600 text-sm mb-2 line-clamp-2">{note.content}</p>
              {#if note.tags.length > 0}
                <div class="flex flex-wrap gap-1">
                  {#each note.tags as tag}
                    <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}
              <div class="text-xs text-gray-500 mt-2">
                ID: {note.id} • {new Date(note.createdAt).toLocaleString('ru-RU')}
              </div>
            </div>
          {/each}
        </div>
        
        {#if $notes.length > 5}
          <div class="mt-4 text-center">
            <a 
              href="/test" 
              class="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Посмотреть все заметки →
            </a>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Информация о функциях -->
    <div class="mt-8 bg-blue-50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-blue-800 mb-3">🚀 Функции компонента</h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-medium text-blue-700 mb-2">Валидация:</h4>
          <ul class="text-blue-600 space-y-1">
            <li>• Заголовок: обязательное, макс 100 символов</li>
            <li>• Содержание: обязательное, макс 5000 символов</li>
            <li>• Теги: опционально, макс 10 тегов по 50 символов</li>
            <li>• Валидация в реальном времени</li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-blue-700 mb-2">UX функции:</h4>
          <ul class="text-blue-600 space-y-1">
            <li>• Автоматическое изменение размера textarea</li>
            <li>• Счетчики символов</li>
            <li>• Предварительный просмотр тегов</li>
            <li>• Анимации и переходы</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>