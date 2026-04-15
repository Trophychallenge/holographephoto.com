<script lang="ts">
	const highlights = [
		'Upload a photo or take one on your phone',
		'Add a handwriting or drawing overlay',
		'Preview the final keepsake before ordering'
	];

	const useCases = [
		{
			title: 'Wedding and event favors',
			copy: 'Made for guest tables, bridal parties, welcome gifts, and premium small-batch runs.',
			image: '/holographe/lydholowed.png',
			alt: 'Wedding holographic keepsake magnet'
		},
		{
			title: 'Family and signature pieces',
			copy: 'Use a photo on its own or layer in a note, drawing, or handwriting overlay.',
			image: '/holographe/leo.png',
			alt: 'Signature holographic keepsake magnet'
		}
	];

	const reelMoments = ['Live shimmer', 'Real movement', 'Deluxe finish'];
	const promiseRail = [
		'Premium holographic finish',
		'Photo + handwriting overlays',
		'Mobile-friendly customizer',
		'Group order pricing',
		'Gift-ready keepsake feel'
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
					<div class="visual-orb visual-orb-one"></div>
					<div class="visual-orb visual-orb-two"></div>
					<div class="visual-grid"></div>
					<div class="visual-main">
						<video
							class="visual-video"
							src="/holographe/hero-reel.mov"
							autoplay
							muted
							loop
							playsinline
							preload="metadata"
						></video>
						<div class="visual-badge">From $25</div>
					</div>

					<div class="visual-card visual-card-left">
						<p>Upload photo</p>
						<span>Built for mobile</span>
					</div>

					<div class="visual-card visual-card-right">
						<p>Deluxe shimmer</p>
						<span>Video preview</span>
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
		<div class="page-wrap">
			<div class="promise-rail" aria-hidden="true">
				<div class="promise-track">
					{#each [...promiseRail, ...promiseRail] as item, index (`${item}-${index}`)}
						<span>{item}</span>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="page-wrap video-grid">
			<div class="glass-card video-copy">
				<p class="eyebrow">Live preview</p>
				<h2>See the finish before you order.</h2>
				<p>
					This section is ready for the polished edited reel. Right now it uses the raw uploaded
					clip so we can design the page around the final motion slot.
				</p>
				<div class="reel-tags">
					{#each reelMoments as item}
						<span>{item}</span>
					{/each}
				</div>
				<div class="hero-actions">
					<a class="button-primary" href="/customize">Customize yours</a>
					<a class="button-secondary" href="/contact">Ask about custom work</a>
				</div>
			</div>

			<div class="glass-card video-stage">
				<div class="video-shell">
					<video
						class="hero-video"
						src="/holographe/hero-reel.mov"
						autoplay
						muted
						loop
						playsinline
						controls
						preload="metadata"
					>
						<track kind="captions" />
					</video>
					<div class="video-glow"></div>
				</div>
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
				<h2>Upload, layer, preview, order.</h2>
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
	.bulk-card,
	.video-copy,
	.video-stage {
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

	.visual-grid {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
		background-size: 24px 24px;
		mask-image: radial-gradient(circle at center, black 40%, transparent 82%);
		opacity: 0.35;
		pointer-events: none;
	}

	.visual-orb {
		position: absolute;
		border-radius: 999px;
		filter: blur(34px);
		opacity: 0.72;
		pointer-events: none;
	}

	.visual-orb-one {
		top: -1rem;
		right: 8%;
		width: 8rem;
		height: 8rem;
		background: radial-gradient(circle, rgba(199, 216, 255, 0.9), transparent 68%);
		animation: driftOne 7s ease-in-out infinite;
	}

	.visual-orb-two {
		left: 8%;
		bottom: 0.5rem;
		width: 7rem;
		height: 7rem;
		background: radial-gradient(circle, rgba(242, 182, 223, 0.72), transparent 70%);
		animation: driftTwo 8.5s ease-in-out infinite;
	}

	.visual-main {
		position: relative;
		width: min(19rem, 76%);
	}

	.visual-video {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		border-radius: 1.15rem;
		box-shadow: 0 24px 50px rgba(0, 0, 0, 0.35);
		background: #08090d;
	}

	.visual-main::before {
		content: '';
		position: absolute;
		inset: -0.45rem;
		border-radius: 1.45rem;
		background: linear-gradient(
			135deg,
			rgba(240, 222, 192, 0.18),
			rgba(199, 216, 255, 0.22),
			rgba(242, 182, 223, 0.16)
		);
		filter: blur(18px);
		opacity: 0.8;
		z-index: 0;
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
	.video-grid,
	.split-grid {
		display: grid;
		gap: 1.2rem;
	}

	.video-grid {
		grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
		align-items: center;
	}

	.video-copy,
	.video-stage {
		display: grid;
		gap: 1rem;
	}

	.reel-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}

	.reel-tags span {
		padding: 0.55rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.1),
				rgba(199, 216, 255, 0.1),
				rgba(242, 182, 223, 0.08)
			),
			rgba(255, 255, 255, 0.03);
		color: var(--text);
		font-size: 0.88rem;
	}

	.video-shell {
		position: relative;
		padding: 0.85rem;
		border-radius: 1.4rem;
		background: linear-gradient(145deg, rgba(18, 18, 24, 0.98), rgba(10, 10, 14, 0.94));
		overflow: hidden;
	}

	.video-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		padding: 1px;
		border-radius: 1.4rem;
		background: linear-gradient(
			120deg,
			rgba(240, 222, 192, 0.75),
			rgba(199, 216, 255, 0.85),
			rgba(242, 182, 223, 0.75),
			rgba(240, 222, 192, 0.75)
		);
		background-size: 200% 100%;
		animation: borderFlow 6s linear infinite;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask-composite: exclude;
		pointer-events: none;
	}

	.hero-video {
		position: relative;
		display: block;
		width: 100%;
		max-height: 42rem;
		border-radius: 1rem;
		background: #08090d;
		object-fit: cover;
		box-shadow: 0 26px 56px rgba(0, 0, 0, 0.34);
		z-index: 1;
	}

	.video-glow {
		position: absolute;
		inset: auto 8% 4% 8%;
		height: 18%;
		border-radius: 999px;
		background: linear-gradient(
			90deg,
			rgba(240, 222, 192, 0.18),
			rgba(199, 216, 255, 0.28),
			rgba(242, 182, 223, 0.18)
		);
		filter: blur(28px);
		opacity: 0.8;
	}

	.promise-rail {
		position: relative;
		overflow: hidden;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(
				135deg,
				rgba(240, 222, 192, 0.06),
				rgba(199, 216, 255, 0.08),
				rgba(242, 182, 223, 0.06)
			),
			rgba(255, 255, 255, 0.03);
	}

	.promise-track {
		display: flex;
		gap: 2rem;
		width: max-content;
		padding: 0.9rem 1.2rem;
		animation: railMove 24s linear infinite;
	}

	.promise-track span {
		position: relative;
		padding-left: 1rem;
		color: var(--text);
		font-size: 0.88rem;
		letter-spacing: 0.03em;
		white-space: nowrap;
	}

	.promise-track span::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.42rem;
		width: 0.42rem;
		height: 0.42rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #f0dec0, #c7d8ff, #f2b6df);
		box-shadow: 0 0 12px rgba(199, 216, 255, 0.34);
	}

	.use-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.use-card {
		display: grid;
		gap: 1rem;
	}

	.use-card img {
		display: block;
		width: 100%;
		height: 14rem;
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
		.video-grid,
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

		.promise-track {
			animation-duration: 30s;
		}
	}

	@keyframes driftOne {
		0%,
		100% {
			transform: translate3d(0, 0, 0) scale(1);
		}

		50% {
			transform: translate3d(-14px, 10px, 0) scale(1.06);
		}
	}

	@keyframes driftTwo {
		0%,
		100% {
			transform: translate3d(0, 0, 0) scale(1);
		}

		50% {
			transform: translate3d(16px, -12px, 0) scale(0.96);
		}
	}

	@keyframes borderFlow {
		from {
			background-position: 0% 50%;
		}

		to {
			background-position: 200% 50%;
		}
	}

	@keyframes railMove {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-50%);
		}
	}
</style>
