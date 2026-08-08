<script lang="ts">
	import type { ProductMedia as ProductMediaItem } from '$lib/products/halloween';

	let {
		media = [],
		label,
		variant = 'card',
		autoplay = false
	}: {
		media?: ProductMediaItem[];
		label: string;
		variant?: 'card' | 'detail';
		autoplay?: boolean;
	} = $props();

	let failed = $state(false);
	const mediaToDisplay = $derived(variant === 'detail' ? media : media.slice(0, 1));
</script>

<div class:detail={variant === 'detail'} class="product-media">
	{#if mediaToDisplay.length && !failed}
		{#each mediaToDisplay as mediaItem (mediaItem.src)}
			<div class:video-frame={mediaItem.type === 'video'} class="media-frame">
				{#if mediaItem.type === 'video'}
					<video
						class="product-media-element"
						src={mediaItem.src}
						poster={mediaItem.poster}
						muted
						{autoplay}
						loop={autoplay}
						playsinline
						preload={variant === 'detail' ? 'metadata' : 'none'}
						controls={variant === 'detail'}
						aria-label={mediaItem.alt}
						onerror={() => (failed = true)}
					></video>
				{:else}
					<img
						class="product-media-element"
						src={mediaItem.src}
						alt={mediaItem.alt}
						loading={variant === 'detail' ? 'eager' : 'lazy'}
						onerror={() => (failed = true)}
					/>
				{/if}
			</div>
		{/each}
	{:else}
		<div class="media-fallback" role="img" aria-label={`${label} media preview unavailable`}>
			<span>Holographe</span>
			<strong>{failed ? 'Media preview unavailable' : 'Collection reveal in progress'}</strong>
		</div>
	{/if}
</div>

<style>
	.product-media {
		position: relative;
		aspect-ratio: 9 / 16;
		overflow: hidden;
		background: #101014;
	}

	.product-media.detail {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 0.75rem;
		aspect-ratio: auto;
		padding: 0.75rem;
		border-radius: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.media-frame {
		min-height: 0;
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.media-frame.video-frame {
		aspect-ratio: 9 / 16;
	}

	.product-media:not(.detail) .media-frame {
		width: 100%;
		height: 100%;
	}

	.product-media-element {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #090909;
	}

	.media-fallback {
		display: grid;
		align-content: end;
		gap: 0.45rem;
		width: 100%;
		height: 100%;
		padding: 1.25rem;
		background:
			radial-gradient(circle at 72% 18%, rgba(222, 159, 79, 0.24), transparent 24%),
			radial-gradient(circle at 20% 72%, rgba(109, 65, 144, 0.3), transparent 32%),
			linear-gradient(140deg, #100c13, #17100f 52%, #0b0b0e);
		color: rgba(255, 248, 239, 0.88);
	}

	.media-fallback::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			112deg,
			transparent 30%,
			rgba(255, 239, 208, 0.08) 48%,
			transparent 65%
		);
		pointer-events: none;
	}

	.media-fallback span {
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: #e6bd8d;
	}

	.media-fallback strong {
		max-width: 13rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.35rem, 4vw, 2rem);
		font-weight: 500;
		line-height: 1.05;
	}
</style>
