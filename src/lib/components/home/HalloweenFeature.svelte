<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section class="halloween-feature" aria-labelledby="halloween-feature-title">
	<div class="halloween-feature-copy">
		<p class="eyebrow">Seasonal release</p>
		<h2 id="halloween-feature-title">Halloween Edition</h2>
		<p>Light-catching magnetic decor for a delightfully haunted home.</p>
		<a class="button-primary" href={resolve('/collections/halloween')}>Shop Halloween <span aria-hidden="true">→</span></a>
	</div>
	<div class="halloween-feature-mark" aria-hidden="true"><span>Limited<br />seasonal<br />edition</span></div>
</section>

<style>
	.halloween-feature {
		position: relative;
		display: flex;
		justify-content: space-between;
		gap: 1.25rem;
		align-items: center;
		width: min(1160px, calc(100vw - 1.1rem));
		margin: 0 auto 0.75rem;
		padding: clamp(1.25rem, 2.6vw, 1.7rem) clamp(1.25rem, 3.5vw, 2.4rem);
		border: 1px solid rgba(255, 122, 26, 0.42);
		border-radius: 1.15rem;
		background:
			linear-gradient(100deg, rgba(255, 109, 24, 0.12), transparent 38%),
			linear-gradient(118deg, #14070d, #100611 68%, #19100d);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 48px rgba(0, 0, 0, 0.24);
		overflow: hidden;
	}

	.halloween-feature::before {
		content: '';
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 76% 28%, rgba(255, 93, 18, 0.32), transparent 18%),
			linear-gradient(108deg, transparent 56%, rgba(185, 62, 255, 0.18) 67%, transparent 76%);
		pointer-events: none;
	}

	.halloween-feature-copy,
	.halloween-feature-mark {
		position: relative;
		z-index: 1;
	}

	.halloween-feature-copy h2 {
		margin: 0.45rem 0 0.45rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 4vw, 2.85rem);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 0.98;
	}

	.halloween-feature-copy p:not(.eyebrow) {
		max-width: 38rem;
		margin: 0 0 1rem;
		color: #f5dfe9;
		font-size: 1rem;
	}

	.halloween-feature-mark {
		position: relative;
		display: grid;
		place-items: center;
		width: clamp(6.75rem, 14vw, 9.25rem);
		aspect-ratio: 1;
		border: 1px solid rgba(255, 164, 56, 0.64);
		border-radius: 50%;
		background: radial-gradient(circle at 34% 26%, rgba(255, 244, 225, 0.55), rgba(255, 113, 26, 0.3) 24%, rgba(83, 20, 83, 0.42) 61%, transparent 62%);
		box-shadow: 0 0 32px rgba(255, 89, 18, 0.19);
		transform: rotate(-8deg);
	}

	.halloween-feature-mark span {
		font-size: 0.61rem;
		font-weight: 700;
		letter-spacing: 0.17em;
		text-transform: uppercase;
		line-height: 1.55;
		text-align: center;
		color: #fff0df;
	}

	:global(.halloween-feature .button-primary) {
		background: linear-gradient(135deg, #ffbc52, #ff641e 48%, #dc3a19);
		color: #17090d;
		box-shadow: 0 12px 30px rgba(255, 89, 18, 0.28);
	}

	@media (max-width: 720px) {
		.halloween-feature { padding: 1.25rem; }
		.halloween-feature-mark {
			width: 5.7rem;
			flex: 0 0 auto;
		}
	}
</style>
