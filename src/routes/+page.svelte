<script lang="ts">
	const highlights = [
		'Upload a photo or take one on your phone',
		'Add a handwriting or drawing overlay',
		'Preview the final keepsake before ordering'
	];

	const useCases = [
		{
			title: 'Wedding favors',
			copy: 'A polished gift for guests, bridal parties, and milestone tables.',
			image: '/holographe/lydholowed.png',
			alt: 'Wedding holographic keepsake magnet'
		},
		{
			title: 'Family gifts',
			copy: 'Made for Christmas, anniversaries, birthdays, and everyday memories.',
			image: '/holographe/jessholo.png',
			alt: 'Family holographic keepsake magnet'
		},
		{
			title: 'Signature keepsakes',
			copy: 'Layer handwritten notes, child art, or meaningful details over the photo.',
			image: '/holographe/leo.png',
			alt: 'Signature holographic keepsake magnet'
		}
	];
</script>

<svelte:head>
	<title>Holographe | Premium Photo Keepsakes</title>
	<meta
		name="description"
		content="Premium holographic photo magnets with a mobile-friendly customizer for uploading photos, adding overlays, and previewing the final keepsake."
	/>
</svelte:head>

<div class="page-shell">
	<section class="section hero">
		<div class="page-wrap hero-wrap">
			<div class="hero-copy">
				<p class="eyebrow">Premium keepsake studio</p>
				<h1>Make a memory feel finished.</h1>
				<p class="hero-text">
					A cleaner, more personal way to turn a photo, note, or child’s drawing into something
					people keep.
				</p>

				<div class="hero-actions">
					<a class="button-primary" href="/customize">Open the studio</a>
					<a class="button-secondary" href="/prices">See pricing</a>
				</div>

				<ul class="highlight-list">
					{#each highlights as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>

			<div class="hero-visual glass-card">
				<div class="visual-stack">
					<div class="visual-main">
						<img src="/holographe/lydholowed.png" alt="Featured Holographe keepsake" />
						<div class="visual-badge">From $25</div>
					</div>

					<div class="visual-card visual-card-left">
						<p>Upload photo</p>
						<span>Mobile ready</span>
					</div>

					<div class="visual-card visual-card-right">
						<p>Add overlay</p>
						<span>Handwriting or art</span>
					</div>
				</div>

				<a class="launch-card" href="/customize">
					<div>
						<p class="launch-kicker">Interactive customizer</p>
						<h2>Build your keepsake on a full screen.</h2>
					</div>
					<span>Open</span>
				</a>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap use-grid">
			{#each useCases as item}
				<article class="glass-card use-card">
					<img src={item.image} alt={item.alt} />
					<div>
						<h2>{item.title}</h2>
						<p>{item.copy}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="section">
		<div class="page-wrap split-grid">
			<div class="glass-card studio-promo">
				<p class="eyebrow">Customize</p>
				<h2>Upload, place, preview, order.</h2>
				<p>
					The studio page is built for phones and larger screens, with direct upload actions and a
					clear ordering path.
				</p>
				<a class="button-primary" href="/customize">Start customizing</a>
			</div>

			<div class="glass-card bulk-card">
				<p class="eyebrow">Bulk gifts</p>
				<h2>Great for group orders.</h2>
				<p>
					Wedding favors, holiday gifts for family, party favors, and other keepsake-style sets.
				</p>
				<a class="button-secondary" href="/prices">See bulk pricing</a>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at top left, rgba(199, 216, 255, 0.16), transparent 24%),
			radial-gradient(circle at 80% 12%, rgba(242, 182, 223, 0.12), transparent 22%),
			radial-gradient(circle at bottom right, rgba(217, 180, 102, 0.12), transparent 26%),
			linear-gradient(180deg, #060607 0%, #0b0b0f 52%, #060607 100%);
	}

	.page-shell {
		min-height: 100vh;
	}

	h1,
	h2,
	p,
	ul {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.05em;
	}

	h1 {
		font-size: clamp(3rem, 7vw, 5.6rem);
		line-height: 0.92;
		max-width: 8ch;
	}

	h2 {
		font-size: clamp(1.5rem, 2.5vw, 2.3rem);
		line-height: 1.05;
	}

	p,
	li {
		color: var(--muted);
		line-height: 1.7;
	}

	.hero-wrap {
		display: grid;
		grid-template-columns: minmax(0, 0.94fr) minmax(360px, 1.06fr);
		align-items: center;
		gap: 2rem;
		padding: 2rem 0 1rem;
	}

	.hero-copy {
		display: grid;
		gap: 1.2rem;
		max-width: 34rem;
	}

	.hero-text {
		max-width: 32rem;
		font-size: 1.02rem;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
	}

	.highlight-list {
		display: grid;
		gap: 0.6rem;
		padding: 0;
		list-style: none;
	}

	.highlight-list li {
		position: relative;
		padding-left: 1.15rem;
	}

	.highlight-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62rem;
		width: 0.46rem;
		height: 0.46rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #f0dec0, #c7d8ff, #f2b6df);
		box-shadow: 0 0 16px rgba(199, 216, 255, 0.38);
	}

	.hero-visual,
	.use-card,
	.studio-promo,
	.bulk-card {
		padding: 1.4rem;
		border-radius: 1.6rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
			linear-gradient(160deg, rgba(14, 14, 18, 0.88), rgba(10, 10, 14, 0.8));
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 24px 60px rgba(0, 0, 0, 0.28);
	}

	.hero-visual {
		display: grid;
		gap: 1rem;
		min-height: 34rem;
	}

	.visual-stack {
		position: relative;
		min-height: 24rem;
		display: grid;
		place-items: center;
		border-radius: 1.4rem;
		background:
			radial-gradient(circle at top, rgba(199, 216, 255, 0.16), transparent 30%),
			linear-gradient(145deg, rgba(26, 27, 33, 0.96), rgba(14, 14, 18, 0.92));
		overflow: hidden;
	}

	.visual-main {
		position: relative;
		width: min(19rem, 76%);
	}

	.visual-main img {
		display: block;
		width: 100%;
		border-radius: 1.15rem;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
	}

	.visual-badge {
		position: absolute;
		right: -0.7rem;
		bottom: 0.8rem;
		padding: 0.58rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.18),
				rgba(199, 216, 255, 0.16),
				rgba(242, 182, 223, 0.16)
			),
			rgba(15, 15, 19, 0.86);
		color: var(--text);
		font-weight: 700;
	}

	.visual-card {
		position: absolute;
		padding: 0.9rem 1rem;
		border-radius: 1.1rem;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
			rgba(10, 10, 14, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(16px);
		box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
	}

	.visual-card p {
		color: var(--text);
		font-weight: 700;
	}

	.visual-card span {
		color: var(--muted);
		font-size: 0.88rem;
	}

	.visual-card-left {
		left: 1rem;
		bottom: 1.4rem;
	}

	.visual-card-right {
		right: 1rem;
		top: 1.4rem;
	}

	.launch-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.1rem;
		border-radius: 1.2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.12),
				rgba(199, 216, 255, 0.12),
				rgba(242, 182, 223, 0.08)
			),
			rgba(12, 12, 16, 0.82);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.launch-card:hover,
	.use-card:hover {
		transform: translateY(-2px);
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
	}

	.launch-kicker {
		margin-bottom: 0.25rem;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		font-weight: 700;
	}

	.launch-card span {
		padding: 0.65rem 0.85rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: var(--text);
		font-weight: 700;
	}

	.use-grid,
	.split-grid {
		display: grid;
		gap: 1.2rem;
	}

	.use-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.use-card {
		display: grid;
		gap: 1rem;
	}

	.use-card img {
		display: block;
		width: 100%;
		height: 13rem;
		object-fit: cover;
		border-radius: 1.1rem;
	}

	.use-card div {
		display: grid;
		gap: 0.55rem;
	}

	.split-grid {
		grid-template-columns: 1.1fr 0.9fr;
	}

	.studio-promo,
	.bulk-card {
		display: grid;
		gap: 0.85rem;
		min-height: 100%;
	}

	@media (max-width: 960px) {
		.hero-wrap,
		.use-grid,
		.split-grid {
			grid-template-columns: 1fr;
		}

		.hero-wrap {
			padding-top: 1rem;
		}

		.hero-visual {
			min-height: auto;
		}

		.visual-stack {
			min-height: 21rem;
		}
	}
</style>
