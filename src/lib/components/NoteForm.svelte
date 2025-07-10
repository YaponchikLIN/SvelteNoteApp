<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { NoteCreate } from '$lib/types';
  import { notesActions } from '$lib/stores';

  // Event dispatcher для уведомления родительского компонента
  const dispatch = createEventDispatcher<{
    noteCreated: { note: NoteCreate; id: number };
    cancel: void;
  }>();

  // Состояние формы
  let formData: NoteCreate = {
    title: '',
    content: '',
    tags: []
  };

  // Состояние валидации
  let errors: Record<string, string> = {};
  let touched: Record<string, boolean> = {};
  let isSubmitting = false;

  // Вспомогательные переменные для UI
  let tagsInput = '';
  let titleCharCount = 0;
  let contentCharCount = 0;

  // Реактивные вычисления
  $: titleCharCount = formData.title.length;
  $: contentCharCount = formData.content.length;
  $: isFormValid = !Object.keys(errors).length && formData.title.trim() && formData.content.trim();

  // Валидация в реальном времени
  $: validateField('title', formData.title);
  $: validateField('content', formData.content);
  $: validateField('tags', tagsInput);

  function validateField(field: string, value: string) {
    const newErrors = { ...errors };

    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Заголовок обязателен';
        } else if (value.length > 100) {
          newErrors.title = 'Заголовок не может быть длиннее 100 символов';
        } else {
          delete newErrors.title;
        }
        break;

      case 'content':
        if (!value.trim()) {
          newErrors.content = 'Содержание обязательно';
        } else if (value.length > 5000) {
          newErrors.content = 'Содержание не может быть длиннее 5000 символов';
        } else {
          delete newErrors.content;
        }
        break;

      case 'tags':
        // Валидация тегов (опциональное поле)
        if (value.trim()) {
          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          if (tags.some(tag => tag.length > 50)) {
            newErrors.tags = 'Каждый тег не может быть длиннее 50 символов';
          } else if (tags.length > 10) {
            newErrors.tags = 'Максимум 10 тегов';
          } else {
            delete newErrors.tags;
          }
        } else {
          delete newErrors.tags;
        }
        break;
    }

    errors = newErrors;
  }

  function handleFieldBlur(field: string) {
    touched = { ...touched, [field]: true };
  }

  function parseTags(tagsString: string): string[] {
    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  async function handleSubmit() {
    // Отмечаем все поля как touched
    touched = { title: true, content: true, tags: true };

    if (!isFormValid) {
      return;
    }

    isSubmitting = true;

    try {
      // Парсим теги
      formData.tags = parseTags(tagsInput);

      // Создаем заметку через store action
      const id = await notesActions.createNote(formData);

      // Уведомляем родительский компонент
      dispatch('noteCreated', { note: formData, id });

      // Очищаем форму
      resetForm();

    } catch (error) {
      console.error('Ошибка создания заметки:', error);
      // Ошибка уже обработана в notesActions
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formData = {
      title: '',
      content: '',
      tags: []
    };
    tagsInput = '';
    errors = {};
    touched = {};
  }

  function handleCancel() {
    resetForm();
    dispatch('cancel');
  }

  // Функция для автоматического изменения размера textarea
  function autoResize(node: HTMLTextAreaElement) {
    function resize() {
      node.style.height = 'auto';
      node.style.height = node.scrollHeight + 'px';
    }

    node.addEventListener('input', resize);
    resize();

    return {
      destroy() {
        node.removeEventListener('input', resize);
      }
    };
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Заголовок формы -->
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Создать новую заметку</h2>
    <p class="text-gray-600">Заполните поля ниже для создания заметки</p>
  </div>

  <!-- Поле заголовка -->
  <div class="space-y-2">
    <label for="title" class="block text-sm font-medium text-gray-700">
      Заголовок <span class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        id="title"
        type="text"
        bind:value={formData.title}
        on:blur={() => handleFieldBlur('title')}
        placeholder="Введите заголовок заметки..."
        maxlength="100"
        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
               {errors.title && touched.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}
               {formData.title && !errors.title ? 'border-green-500 bg-green-50' : ''}"
        disabled={isSubmitting}
      />
      <div class="absolute right-3 top-3 text-xs text-gray-500">
        {titleCharCount}/100
      </div>
    </div>
    {#if errors.title && touched.title}
      <p class="text-sm text-red-600 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {errors.title}
      </p>
    {/if}
  </div>

  <!-- Поле содержания -->
  <div class="space-y-2">
    <label for="content" class="block text-sm font-medium text-gray-700">
      Содержание <span class="text-red-500">*</span>
    </label>
    <div class="relative">
      <textarea
        id="content"
        bind:value={formData.content}
        on:blur={() => handleFieldBlur('content')}
        placeholder="Введите содержание заметки..."
        maxlength="5000"
        rows="6"
        use:autoResize
        class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none
               {errors.content && touched.content ? 'border-red-500 bg-red-50' : 'border-gray-300'}
               {formData.content && !errors.content ? 'border-green-500 bg-green-50' : ''}"
        disabled={isSubmitting}
      ></textarea>
      <div class="absolute right-3 bottom-3 text-xs text-gray-500 bg-white px-1 rounded">
        {contentCharCount}/5000
      </div>
    </div>
    {#if errors.content && touched.content}
      <p class="text-sm text-red-600 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {errors.content}
      </p>
    {/if}
  </div>

  <!-- Поле тегов -->
  <div class="space-y-2">
    <label for="tags" class="block text-sm font-medium text-gray-700">
      Теги
      <span class="text-gray-500 text-xs">(опционально, разделяйте запятыми)</span>
    </label>
    <input
      id="tags"
      type="text"
      bind:value={tagsInput}
      on:blur={() => handleFieldBlur('tags')}
      placeholder="работа, важное, идеи..."
      class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
             {errors.tags && touched.tags ? 'border-red-500 bg-red-50' : 'border-gray-300'}"
      disabled={isSubmitting}
    />
    {#if errors.tags && touched.tags}
      <p class="text-sm text-red-600 flex items-center">
        <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {errors.tags}
      </p>
    {/if}
    {#if tagsInput.trim() && !errors.tags}
      <div class="flex flex-wrap gap-2">
        {#each parseTags(tagsInput) as tag}
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Кнопки действий -->
  <div class="flex flex-col sm:flex-row gap-3 pt-4">
    <button
      type="submit"
      disabled={!isFormValid || isSubmitting}
      class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium
             hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
             flex items-center justify-center"
    >
      {#if isSubmitting}
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Создание...
      {:else}
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Создать заметку
      {/if}
    </button>

    <button
      type="button"
      on:click={handleCancel}
      disabled={isSubmitting}
      class="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium
             hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
             flex items-center justify-center"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      Отмена
    </button>
  </div>

  <!-- Подсказки -->
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h4 class="text-sm font-medium text-blue-800 mb-2">💡 Подсказки:</h4>
    <ul class="text-sm text-blue-700 space-y-1">
      <li>• Заголовок должен быть кратким и описательным</li>
      <li>• Используйте теги для лучшей организации заметок</li>
      <li>• Поддерживается форматирование текста с переносами строк</li>
    </ul>
  </div>
</form>

<style>
  /* Дополнительные стили для анимаций */
  .fade-in {
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

  /* Стили для автоматического изменения размера textarea */
  textarea {
    min-height: 120px;
    max-height: 400px;
  }
</style>