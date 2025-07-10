<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { ErrorType, ErrorSeverity } from '$lib/types';

  export let error: Error | string | null = null;
  export let type: ErrorType = 'error';
  export let severity: ErrorSeverity = 'medium';
  export let title: string = '';
  export let message: string = '';
  export let details: string = '';
  export let showDetails: boolean = false;
  export let autoClose: boolean = true;
  export let autoCloseDelay: number = 5000;
  export let persistent: boolean = false;
  export let retryable: boolean = false;
  export let onRetry: (() => void) | null = null;

  const dispatch = createEventDispatcher<{
    close: void;
    retry: void;
    details: boolean;
  }>();

  let isVisible = true;
  let detailsExpanded = false;
  let autoCloseTimer: NodeJS.Timeout | null = null;

  $: errorMessage = error instanceof Error ? error.message : error || message;
  $: errorTitle = title || getDefaultTitle(type);
  $: errorDetails = details || (error instanceof Error ? error.stack : '');

  $: severityClasses = {
    low: 'bg-blue-50 border-blue-200 text-blue-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-red-50 border-red-200 text-red-800',
    critical: 'bg-red-100 border-red-300 text-red-900'
  };

  $: iconClasses = {
    low: 'text-blue-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
    critical: 'text-red-600'
  };

  function getDefaultTitle(errorType: ErrorType): string {
    const titles = {
      error: 'Ошибка',
      warning: 'Предупреждение',
      info: 'Информация',
      network: 'Ошибка сети',
      validation: 'Ошибка валидации',
      permission: 'Ошибка доступа',
      timeout: 'Превышено время ожидания',
      storage: 'Ошибка хранилища'
    };
    return titles[errorType] || 'Ошибка';
  }

  function getIcon(errorType: ErrorType): string {
    const icons = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      network: '🌐',
      validation: '📝',
      permission: '🔒',
      timeout: '⏰',
      storage: '💾'
    };
    return icons[errorType] || '❌';
  }

  function close() {
    isVisible = false;
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }
    setTimeout(() => dispatch('close'), 300);
  }

  function retry() {
    if (onRetry) {
      onRetry();
    }
    dispatch('retry');
    close();
  }

  function toggleDetails() {
    detailsExpanded = !detailsExpanded;
    dispatch('details', detailsExpanded);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    }
  }

  onMount(() => {
    if (autoClose && !persistent) {
      autoCloseTimer = setTimeout(() => {
        close();
      }, autoCloseDelay);
    }

    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isVisible && (error || message)}
  <div
    class="fixed top-4 right-4 z-50 max-w-md w-full"
    transition:fly={{ x: 300, duration: 300 }}
    role="alert"
    aria-live="assertive"
  >
    <div
      class="border rounded-lg shadow-lg p-4 {severityClasses[severity]} animate-fade-in-down"
      class:animate-shake={severity === 'critical'}
    >
      <!-- Заголовок -->
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-xl {iconClasses[severity]}" aria-hidden="true">
            {getIcon(type)}
          </span>
          <h3 class="font-semibold text-sm">
            {errorTitle}
          </h3>
        </div>
        
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          on:click={close}
          aria-label="Закрыть уведомление"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>

      <!-- Сообщение -->
      {#if errorMessage}
        <p class="mt-2 text-sm opacity-90">
          {errorMessage}
        </p>
      {/if}

      <!-- Детали ошибки -->
      {#if errorDetails && showDetails}
        <div class="mt-3">
          <button
            type="button"
            class="text-xs underline opacity-75 hover:opacity-100 transition-opacity duration-200"
            on:click={toggleDetails}
          >
            {detailsExpanded ? 'Скрыть детали' : 'Показать детали'}
          </button>
          
          {#if detailsExpanded}
            <div
              class="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs font-mono overflow-auto max-h-32"
              transition:fade={{ duration: 200 }}
            >
              <pre class="whitespace-pre-wrap">{errorDetails}</pre>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Действия -->
      <div class="mt-3 flex space-x-2">
        {#if retryable && onRetry}
          <button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 transform hover:scale-105"
            on:click={retry}
          >
            Повторить
          </button>
        {/if}
        
        {#if !autoClose || persistent}
          <button
            type="button"
            class="px-3 py-1 text-xs font-medium rounded-md bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 transform hover:scale-105"
            on:click={close}
          >
            Закрыть
          </button>
        {/if}
      </div>

      <!-- Прогресс-бар автозакрытия -->
      {#if autoClose && !persistent}
        <div class="mt-3 w-full bg-black bg-opacity-10 rounded-full h-1">
          <div
            class="bg-current h-1 rounded-full animate-pulse"
            style="width: 100%; animation-duration: {autoCloseDelay}ms; animation-name: shrink;"
          ></div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
</style>