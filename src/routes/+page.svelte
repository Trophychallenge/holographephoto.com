<script lang="ts">
	import { resolve } from '$app/paths';
	import HalloweenFeature from '$lib/components/home/HalloweenFeature.svelte';
	import BusinessFeature from '$lib/components/home/BusinessFeature.svelte';
	import CarnivalFeature from '$lib/components/home/CarnivalFeature.svelte';
</script>

<svelte:head>
	<title>Holographe | Photo magnets that change in the light</title>
	<meta
		name="description"
		content="Holographic photo magnets, business-card magnets, and seasonal pieces made to shift in the light."
	/>
</svelte:head>

<div class="page-shell">
	<section class="studio-intro" aria-labelledby="studio-title">
		<p class="eyebrow">Holographic keepsakes, made personal</p>
		<h1 id="studio-title">A little light<br />changes <em>everything.</em></h1>
		<p>Holographe turns favorite photos, business cards, and seasonal artwork into magnetic pieces that come alive as you move.</p>
		<div class="studio-links" aria-label="Shop Holographe">
			<a href={resolve('/customize')}>Photo Magnets <span aria-hidden="true">→</span></a>
			<a href={resolve('/business-cards')}>Business Cards <span aria-hidden="true">→</span></a>
			<a href={resolve('/collections/halloween')}>Halloween Edition <span aria-hidden="true">→</span></a>
		</div>
	</section>
	<HalloweenFeature />
	<CarnivalFeature />
	<BusinessFeature />

	<section class="explore-section" aria-labelledby="explore-heading">
		<div class="explore-intro">
			<p class="eyebrow">The Holographe world</p>
			<h2 id="explore-heading">Explore Holographe</h2>
			<p>
				Halloween Edition is our current seasonal release. Discover the custom keepsakes, digital
				games, and creative formats that make up the rest of Holographe.
			</p>
		</div>

		<div class="explore-grid">
			<a class="explore-card explore-card-featured" href={resolve('/customize')}>
				<span>Custom keepsakes</span>
				<h3>Custom Photo Magnets</h3>
				<p>Upload a favorite photo and shape a light-catching piece made to order.</p>
				<strong>Start with your photo <span aria-hidden="true">→</span></strong>
			</a>
			<a class="explore-card" href={resolve('/games/rival-quest')}>
				<span>Digital games</span>
				<h3>Rival Quest</h3>
				<p>A printable party adventure designed for your next gathering.</p>
				<strong>Explore the game <span aria-hidden="true">→</span></strong>
			</a>
			<a class="explore-card" href={resolve('/formats')}>
				<span>Formats</span>
				<h3>Find your format</h3>
				<p>See the materials, sizes, and finish details behind Holographe pieces.</p>
				<strong>View formats <span aria-hidden="true">→</span></strong>
			</a>
			<a class="explore-card" href={resolve('/gallery')}>
				<span>In the light</span>
				<h3>Gallery</h3>
				<p>Browse the visual language of holographic keepsakes and installations.</p>
				<strong>View the gallery <span aria-hidden="true">→</span></strong>
			</a>
		</div>
	</section>
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at 8% 6%, rgba(231, 206, 173, 0.08), transparent 18%),
			radial-gradient(circle at 82% 16%, rgba(225, 236, 255, 0.05), transparent 16%),
			linear-gradient(180deg, #050505 0%, #090909 42%, #060606 100%);
	}

	.page-shell {
		min-height: 100vh;
		position: relative;
		display: grid;
		gap: 0.25rem;
	}

	.studio-intro {
		position: relative;
		z-index: 1;
		width: min(1120px, calc(100vw - 2rem));
		margin: 0 auto;
		padding: clamp(3rem, 8vw, 7rem) 0 clamp(2rem, 4vw, 4rem);
		text-align: center;
	}

	.studio-intro h1 {
		max-width: 13ch;
		margin: 1rem auto;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(3.4rem, 9vw, 7.4rem);
		font-weight: 500;
		letter-spacing: -0.065em;
		line-height: 0.88;
	}

	.studio-intro h1 em { color: #e9bfe5; font-weight: 400; }
	.studio-intro > p:last-of-type { max-width: 38rem; margin: 1.5rem auto 0; color: var(--muted); font-size: clamp(1rem, 2vw, 1.15rem); line-height: 1.65; }
	.studio-links { display: flex; flex-wrap: wrap; justify-content: center; gap: .7rem; margin-top: 2rem; }
	.studio-links a { border: 1px solid rgba(255,255,255,.2); border-radius: 999px; padding: .8rem 1rem; background: rgba(255,255,255,.06); color: var(--text); font-weight: 700; }
	.studio-links a:first-child { border-color: transparent; background: linear-gradient(100deg, #ffd5dd, #e8c4ff 48%, #c7f1ff); color: #2b1433; }
	.studio-links a span { margin-left: .35rem; }

	.page-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
		mask-image: radial-gradient(circle at center, black 40%, transparent 95%);
	}

	.page-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 20% 18%, rgba(232, 217, 191, 0.04), transparent 16%),
			radial-gradient(circle at 80% 42%, rgba(198, 213, 255, 0.03), transparent 14%);
		opacity: 0.52;
	}

	.explore-section {
		position: relative;
		z-index: 1;
		width: min(1120px, calc(100vw - 1.1rem));
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 6rem) 0 clamp(3rem, 7vw, 6rem);
	}

	.explore-intro {
		max-width: 38rem;
		margin-bottom: 2rem;
	}

	.explore-intro h2 {
		margin: 1.1rem 0 0.85rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 0.95;
	}

	.explore-intro > p:last-child {
		max-width: 34rem;
		margin: 0;
		color: var(--muted);
		font-size: 1rem;
		line-height: 1.7;
	}

	.explore-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	.explore-card {
		display: grid;
		gap: 0.75rem;
		min-height: 15rem;
		padding: clamp(1.25rem, 3vw, 2rem);
		border: 1px solid rgba(255, 255, 255, 0.11);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at 90% 0%, rgba(155, 231, 255, 0.17), transparent 34%),
			radial-gradient(circle at 4% 96%, rgba(255, 184, 218, 0.13), transparent 34%),
			linear-gradient(155deg, rgba(43, 20, 62, 0.94), rgba(14, 22, 49, 0.9));
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
		transition:
			transform 220ms ease,
			border-color 220ms ease,
			background 220ms ease;
	}

	.explore-card:hover {
		transform: translateY(-4px);
		border-color: rgba(234, 195, 143, 0.42);
		background:
			radial-gradient(circle at 90% 0%, rgba(234, 195, 143, 0.13), transparent 34%),
			linear-gradient(155deg, rgba(29, 26, 27, 0.94), rgba(9, 9, 10, 0.84));
	}

	.explore-card span {
		color: #eac38f;
		font-size: 0.66rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.explore-card h3 {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.7rem, 3vw, 2.5rem);
		font-weight: 500;
		letter-spacing: -0.045em;
		line-height: 1;
	}

	.explore-card p {
		max-width: 28rem;
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
	}

	.explore-card strong {
		align-self: end;
		margin-top: 0.6rem;
		color: var(--text);
		font-size: 0.77rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.explore-card strong span {
		margin-left: 0.35rem;
		color: #eac38f;
		font-size: 1rem;
	}

	.explore-card-featured {
		border-color: rgba(234, 195, 143, 0.3);
		background:
			radial-gradient(circle at 88% 8%, rgba(255, 215, 166, 0.24), transparent 32%),
			radial-gradient(circle at 14% 90%, rgba(255, 174, 215, 0.2), transparent 34%),
			linear-gradient(155deg, rgba(80, 25, 70, 0.96), rgba(24, 28, 62, 0.9));
	}

	@media (max-width: 680px) {
		.explore-section {
			padding-top: 3.5rem;
		}

		.explore-grid {
			grid-template-columns: 1fr;
		}

		.explore-card {
			min-height: 13rem;
		}
	}
</style>
