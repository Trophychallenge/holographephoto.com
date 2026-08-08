<script lang="ts">
	import { resolve } from '$app/paths';

	const halloweenVideo = '/media/halloween/HalloweenDishwashermagnets.mp4';
</script>

<section class="halloween-feature" aria-labelledby="halloween-feature-title">
	<div class="halloween-feature-copy">
		<p class="eyebrow">Holographe Exclusive</p>
		<h2 id="halloween-feature-title">Halloween Edition</h2>
		<p>Limited seasonal magnetic decor, composed to transform the everyday.</p>
		<a class="button-primary" href={resolve('/collections/halloween')}>Enter the Collection</a>
	</div>
	<div class="halloween-feature-media">
		<video
			class="halloween-video"
			src={halloweenVideo}
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
			aria-label="Holographe Halloween magnetic decor displayed on a dishwasher"
		></video>
		<div class="halloween-feature-art" aria-hidden="true">
			<span>Limited seasonal release</span>
			<strong>Watch it come alive<br />in the light.</strong>
		</div>
	</div>
</section>

<style>
	.halloween-feature {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.95fr);
		gap: clamp(1.5rem, 5vw, 4rem);
		align-items: center;
		width: min(1160px, calc(100vw - 1.1rem));
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 5rem);
		border: 1px solid rgba(235, 191, 124, 0.2);
		border-radius: 1.8rem;
		background: linear-gradient(120deg, rgba(31, 19, 28, 0.94), rgba(13, 12, 17, 0.96));
		box-shadow: 0 30px 90px rgba(0, 0, 0, 0.32);
		overflow: hidden;
	}

	.halloween-feature::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 80% 28%, rgba(232, 153, 72, 0.16), transparent 25%);
		pointer-events: none;
	}

	.halloween-feature-copy,
	.halloween-feature-media {
		position: relative;
		z-index: 1;
	}

	.halloween-feature-copy h2 {
		max-width: 36rem;
		margin: 1.05rem 0 0.85rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.2rem, 5vw, 4.6rem);
		font-weight: 500;
		letter-spacing: -0.05em;
		line-height: 0.94;
	}

	.halloween-feature-copy p:not(.eyebrow) {
		max-width: 32rem;
		margin: 0 0 1.5rem;
		color: var(--muted);
		font-size: 1.02rem;
	}

	.halloween-feature-media {
		position: relative;
		justify-self: center;
		width: min(100%, 26rem);
		aspect-ratio: 9 / 16;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.25rem;
		background: #0a0a0d;
		overflow: hidden;
	}

	.halloween-video {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
		background: #0a0a0d;
	}

	.halloween-feature-art {
		position: absolute;
		inset: 0;
		display: grid;
		align-content: end;
		padding: 1.5rem;
		background:
			linear-gradient(180deg, rgba(7, 7, 9, 0.02), rgba(7, 7, 9, 0.58)),
			radial-gradient(circle at 22% 76%, rgba(110, 71, 148, 0.28), transparent 32%),
			radial-gradient(circle at 82% 14%, rgba(232, 155, 72, 0.22), transparent 24%);
		overflow: hidden;
		pointer-events: none;
	}

	.halloween-feature-art::after {
		content: '';
		position: absolute;
		inset: -40% 10% auto;
		height: 160%;
		background: linear-gradient(
			112deg,
			transparent 42%,
			rgba(255, 236, 212, 0.18) 50%,
			transparent 58%
		);
		transform: rotate(7deg);
	}

	.halloween-feature-art span,
	.halloween-feature-art strong {
		position: relative;
		z-index: 1;
	}

	.halloween-feature-art span {
		margin-bottom: 0.6rem;
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		color: #e4bb88;
	}

	.halloween-feature-art strong {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.8rem, 3vw, 3rem);
		font-weight: 500;
		line-height: 1;
	}

	@media (max-width: 720px) {
		.halloween-feature {
			grid-template-columns: 1fr;
			padding: 1.35rem;
		}

		.halloween-feature-media {
			width: min(100%, 21rem);
		}
	}
</style>
