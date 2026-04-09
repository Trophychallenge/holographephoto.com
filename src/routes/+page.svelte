<script lang="ts">
	import { resolve } from '$app/paths';

	const highlights = [
		{
			name: 'Your photo, elevated',
			copy: 'A selected image is transformed into a luminous holographic magnet with a polished, dimensional finish.'
		},
		{
			name: 'Optional personal touch',
			copy: 'Add handwritten notes, signatures, dates, or a custom drawing layer to make the piece unmistakably yours.'
		},
		{
			name: 'Made to gift and keep',
			copy: 'Designed as a high-quality keepsake that feels more special than a standard print or magnet.'
		}
	];

	const steps = [
		'Choose the photo that means the most',
		'Add optional handwriting, a note, or a custom sketch',
		'We turn it into a polished holographic magnet',
		'It arrives ready to gift, display, or keep close'
	];
</script>

<svelte:head>
	<title>Holographe | Personalized Holographic Photo Magnets</title>
	<meta
		name="description"
		content="Holographe creates premium personalized holographic photo magnets with optional handwriting and drawing add-ons."
	/>
</svelte:head>

<section class="section hero-section">
	<div class="page-wrap hero-grid">
		<div class="hero-copy">
			<span class="eyebrow">Premium Keepsake Product</span>
			<h1>Your favorite photo, turned into a holographic magnet.</h1>
			<p class="hero-text">
				Holographe is a personalized photo magnet designed to feel high quality, giftable, and
				distinctive. Start with a meaningful image, then add optional handwriting or custom drawing
				details for something far more personal than a standard print.
			</p>
			<div class="button-row">
				<a class="button-primary" href={resolve('/contact')}>Start your order</a>
				<a class="button-secondary" href={resolve('/formats')}>See personalization</a>
			</div>
			<div class="hero-points">
				<span>Personalized gift</span>
				<span>Holographic finish</span>
				<span>Optional handwriting or drawing</span>
			</div>
		</div>

		<div class="hero-panel glass-card">
			<div class="holo-stage">
				<div class="holo-frame">
					<div class="holo-core">
						<div class="holo-shine"></div>
						<div class="holo-subject">
							<p>HOLOGRAPHE</p>
							<p>photo / memory / keepsake</p>
						</div>
					</div>
				</div>
			</div>
			<div class="hero-note">
				<p class="note-label">Product direction</p>
				<p>
					Clean, premium, and emotional. The goal is to make a small object feel meaningful enough
					to keep on display.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap intro-band glass-card">
		<div class="section-head">
			<span class="eyebrow">What it is</span>
			<h2>Not a throwaway novelty magnet.</h2>
			<p>
				This is a polished personalized product built around emotion, memory, and presentation. The
				holographic finish makes it feel elevated. The optional personal add-ons make it yours.
			</p>
		</div>
		<div class="intro-grid">
			<div>
				<p class="mini-title">Premium look</p>
				<p>
					Designed to feel crisp, dimensional, and high quality rather than casual or disposable.
				</p>
			</div>
			<div>
				<p class="mini-title">Personal meaning</p>
				<p>
					A favorite image becomes more intimate when paired with your own writing or drawn details.
				</p>
			</div>
			<div>
				<p class="mini-title">Made to keep</p>
				<p>
					It works as a thoughtful gift, an anniversary piece, a memorial keepsake, or a small
					luxury object for everyday display.
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section">
	<div class="page-wrap">
		<div class="section-head">
			<span class="eyebrow">Highlights</span>
			<h2>Simple product, stronger emotional value.</h2>
		</div>
		<div class="cards-grid">
			{#each highlights as format (format.name)}
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
			<span class="eyebrow">How it works</span>
			<h2>Built around one photo and one very personal detail.</h2>
			<p>
				The site should feel easy to understand: choose the image, decide whether you want a note or
				custom illustration added, then we produce the finished magnet.
			</p>
		</div>
		<div class="glass-card checklist">
			{#each steps as pillar (pillar)}
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
			<h2>Start with the photo. We&apos;ll shape the keepsake around it.</h2>
			<p>
				If you know the image and the message, the rest of the order flow can be refined from there.
			</p>
		</div>
		<a class="button-primary" href={resolve('/contact')}>Start your order</a>
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
