<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let isOpen = false;
	export let title = 'Подтверждение';
	export let message = 'Вы уверены, что хотите выполнить это действие?';
	export let confirmText = 'Подтвердить';
	export let cancelText = 'Отмена';
	export let confirmType: 'danger' | 'primary' = 'primary';

	const dispatch = createEventDispatcher<{
		confirm: void;
		cancel: void;
	}>();

	function handleConfirm() {
		dispatch('confirm');
		isOpen = false;
	}

	function handleCancel() {
		dispatch('cancel');
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleCancel();
		} else if (event.key === 'Enter') {
			handleConfirm();
		}
	}

	$: confirmButtonClass = confirmType === 'danger' 
		? 'btn bg-gradient-to-r from-arcane-red-500 to-arcane-red-600 text-white hover:from-arcane-red-400 hover:to-arcane-red-500 focus:ring-arcane-red-500' 
		: 'btn btn-primary';
</script>

{#if isOpen}
	<!-- Backdrop с эффектом размытия -->
	<div
		class="fixed inset-0 bg-arcane-dark-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
		on:click={handleCancel}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal с эффектами Аркейн -->
		<div
			class="bg-gradient-to-br from-arcane-dark-800/95 to-arcane-dark-900/95 backdrop-blur-xl border border-arcane-blue-500/30 shadow-2xl shadow-arcane-blue-500/20 rounded-lg p-6 max-w-md w-full mx-4 relative overflow-hidden"
			transition:scale={{ duration: 200, start: 0.95 }}
			on:click|stopPropagation
			role="document"
		>
			<!-- Анимированный фон -->
			<div class="absolute inset-0 bg-gradient-to-r from-arcane-blue-500/5 to-arcane-pink-500/5 animate-shimmer"></div>
			<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-arcane-blue-500 via-arcane-pink-500 to-arcane-gold-500"></div>
			
			<!-- Header -->
			<div class="flex items-center justify-between mb-4 relative z-10">
				<h3 id="modal-title" class="text-lg font-semibold text-arcane-blue-100">
					{title}
				</h3>
				<button
					on:click={handleCancel}
					class="text-arcane-blue-400 hover:text-arcane-blue-300 focus:outline-none focus:text-arcane-blue-300 transition-all duration-300 hover:scale-110"
					aria-label="Закрыть"
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="mb-6 relative z-10">
				<p class="text-arcane-blue-200 leading-relaxed">{message}</p>
			</div>

			<!-- Actions -->
			<div class="flex justify-end space-x-3 relative z-10">
				<button
					type="button"
					on:click={handleCancel}
					class="btn btn-secondary hover:scale-105 transition-transform duration-200"
				>
					{cancelText}
				</button>
				<button
					type="button"
					on:click={handleConfirm}
					class="{confirmButtonClass} hover:scale-105 transition-transform duration-200 animate-glow-pulse"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}