<script lang="ts">
	import { resolve } from '$app/paths';

	const formats = [
		{
			name: 'Events',
			copy: 'High-impact guest capture for launches, galas, weddings, and premium parties.'
		},
		{
			name: 'Retail',
			copy: 'Window, in-store, and pop-up holographic moments that stop people mid-walk.'
		},
		{
			name: 'Portraits',
			copy: 'Commissioned holographic portrait pieces built to feel collectible and cinematic.'
		}
	];

	const pillars = [
		'Layered light, motion, and reflective depth',
		'Designed to feel sculptural, not novelty',
		'Portable formats for touring or one-night installs',
		'Creative direction included from concept through capture'
	];
</script>

<svelte:head>
	<title>Holographe | Holographic Photo Experiences</title>
	<meta
		name="description"
		content="Holographe produces immersive holographic photo moments for events, installations, brand activations, and private celebrations."
	/>
</svelte:head>

<section class="section hero-section">
	<div class="page-wrap hero-grid">
		<div class="hero-copy">
			<span class="eyebrow">Holographe Photo</span>
			<h1>Photos that feel like light objects.</h1>
			<p class="hero-text">
				Holographe creates immersive holographic photo experiences that turn a portrait, memory, or
				brand moment into something people stop and stare at.
			</p>
			<div class="button-row">
				<a class="button-primary" href={resolve('/contact')}>Start a project</a>
				<a class="button-secondary" href={resolve('/gallery')}>View gallery</a>
			</div>
			<div class="hero-points">
				<span>Premium events</span>
				<span>Brand activations</span>
				<span>Collectible portraits</span>
			</div>
		</div>

		<div class="hero-panel glass-card">
			<div class="holo-stage">
				<div class="holo-frame">
					<div class="holo-core">
						<div class="holo-shine"></div>
						<div class="holo-subject">
							<p>HOLOGRAPHE</p>
							<p>depth / light / reflection</p>
						</div>
					</div>
				</div>
			</div>
			<div class="hero-note">
				<p class="note-label">Signature feel</p>
				<p>
					A polished visual language built around refraction, motion, luminous edges, and
					exhibition-level presentation.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap intro-band glass-card">
		<div class="section-head">
			<span class="eyebrow">What it is</span>
			<h2>Not a photo booth. Not a screen. Something in between.</h2>
			<p>
				Holographe is for projects that need stronger presence than standard event photography and
				more intimacy than a large-format installation.
			</p>
		</div>
		<div class="intro-grid">
			<div>
				<p class="mini-title">Visual impact</p>
				<p>The final result feels dimensional, reflective, and theatrical from multiple angles.</p>
			</div>
			<div>
				<p class="mini-title">Creative control</p>
				<p>Styling, lighting, backdrop behavior, and motion cues are part of the concept.</p>
			</div>
			<div>
				<p class="mini-title">Flexible output</p>
				<p>
					Built for one-night activations, permanent displays, campaign assets, or private
					commissions.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Use cases</span>
			<h2>Built for premium moments that need a new visual hook.</h2>
		</div>
		<div class="cards-grid">
			{#each formats as format (format.name)}
				<article class="glass-card info-card">
					<h3>{format.name}</h3>
					<p>{format.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap split-band">
		<div class="section-head">
			<span class="eyebrow">Why Holographe</span>
			<h2>Designed to feel elevated from the first glance.</h2>
			<p>
				The aesthetic direction is crisp, futuristic, and warm enough to feel human. The goal is not
				tech for its own sake. The goal is memorability.
			</p>
		</div>
		<div class="glass-card checklist">
			{#each pillars as pillar (pillar)}
				<div class="check-item">
					<span></span>
					<p>{pillar}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap cta-band glass-card">
		<div>
			<span class="eyebrow">Next step</span>
			<h2>Tell me what you want people to feel when they see it.</h2>
			<p>
				That is the best starting point for shaping the right Holographe format, capture approach,
				and installation footprint.
			</p>
		</div>
		<a class="button-primary" href={resolve('/contact')}>Book a consultation</a>
	</div>
</section>

<style>
	.hero-section {
		padding-top: 3rem;
	}

	.hero-grid,
	.split-band {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 1.5rem;
		align-items: center;
	}

	h1,
	h2 {
		margin: 1rem 0 0.85rem;
		line-height: 0.94;
		letter-spacing: -0.05em;
		font-weight: 500;
	}

	h1 {
		font-size: clamp(3.3rem, 8vw, 6.8rem);
		max-width: 12ch;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3.2rem);
	}

	h3 {
		margin: 0 0 0.8rem;
		font-size: 1.45rem;
		font-weight: 500;
	}

	p {
		color: var(--muted);
		line-height: 1.7;
	}

	.hero-text {
		max-width: 36rem;
		font-size: 1.1rem;
	}

	.hero-points {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
		margin-top: 1.2rem;
	}

	.hero-points span,
	.mini-title {
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-2);
	}

	.hero-panel {
		padding: 1.3rem;
	}

	.holo-stage {
		padding: 1.2rem;
		border-radius: 1.3rem;
		background:
			linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			radial-gradient(circle at top, rgba(159, 232, 255, 0.16), transparent 50%);
	}

	.holo-frame {
		border-radius: 1.6rem;
		padding: 1px;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.55),
			rgba(159, 232, 255, 0.2),
			rgba(255, 202, 135, 0.42)
		);
	}

	.holo-core {
		position: relative;
		min-height: 28rem;
		border-radius: 1.55rem;
		overflow: hidden;
		background:
			radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.22), transparent 16%),
			radial-gradient(circle at 80% 20%, rgba(255, 202, 135, 0.14), transparent 18%),
			linear-gradient(
				155deg,
				rgba(255, 255, 255, 0.16),
				rgba(255, 255, 255, 0.04) 35%,
				rgba(0, 0, 0, 0.15) 100%
			),
			linear-gradient(160deg, #102034, #08111c);
	}

	.holo-shine {
		position: absolute;
		inset: 0;
		background:
			repeating-linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.08),
				rgba(255, 255, 255, 0.08) 1px,
				transparent 1px,
				transparent 18px
			),
			linear-gradient(120deg, transparent 16%, rgba(255, 255, 255, 0.16) 42%, transparent 72%);
	}

	.holo-subject {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		text-align: center;
		gap: 0.8rem;
	}

	.holo-subject p:first-child {
		margin: 0;
		color: var(--text);
		font-size: clamp(2.2rem, 5vw, 4rem);
		letter-spacing: 0.18em;
	}

	.holo-subject p:last-child {
		margin: 0;
		font-size: 0.85rem;
		letter-spacing: 0.36em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.hero-note {
		padding: 1rem 0.2rem 0.2rem;
	}

	.note-label {
		margin: 0 0 0.45rem;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent-2);
	}

	.intro-band,
	.cta-band {
		padding: 2rem;
	}

	.intro-grid,
	.cards-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.info-card {
		padding: 1.4rem;
	}

	.checklist {
		padding: 1.6rem;
	}

	.check-item {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.9rem;
		align-items: start;
		padding: 0.95rem 0;
	}

	.check-item + .check-item {
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.check-item span {
		width: 0.8rem;
		height: 0.8rem;
		margin-top: 0.5rem;
		border-radius: 999px;
		background: linear-gradient(135deg, var(--accent), var(--accent-2));
	}

	.check-item p,
	.intro-grid p,
	.info-card p,
	.cta-band p {
		margin: 0;
	}

	.cta-band {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	@media (max-width: 900px) {
		.hero-grid,
		.split-band,
		.intro-grid,
		.cards-grid,
		.cta-band {
			grid-template-columns: 1fr;
		}

		.cta-band {
			display: grid;
			justify-items: start;
		}

		.holo-core {
			min-height: 22rem;
		}
	}
</style>
