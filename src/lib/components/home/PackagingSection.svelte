<section class="section packaging-section">
	<div class="page-wrap packaging-layout">
		<div class="copy">
			<p class="eyebrow">Gift experience</p>
			<h2>Ready to gift. Made to feel special.</h2>
			<p>The finish and the packaging are built to feel complete the moment they arrive.</p>
		</div>

		<div class="gallery">
			<div class="pack-shot large">
				<img src="/holographe/packaging-front.png" alt="Holographe premium card front packaging" />
			</div>
			<div class="pack-shot">
				<img src="/holographe/packaging-back.png" alt="Holographe premium card back packaging" />
			</div>
			<div class="pack-shot">
				<img src="/holographe/packaging-insert.png" alt="Holographe insert packaging card" />
			</div>
		</div>
	</div>
</section>

<style>
	.packaging-layout,
	.copy,
	.gallery {
		display: grid;
		gap: 1rem;
	}

	.copy {
		margin: 0 auto;
		text-align: center;
		justify-items: center;
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.copy p:last-child {
		color: rgba(234, 234, 230, 0.68);
		line-height: 1.7;
		max-width: 38rem;
	}

	.pack-shot {
		padding: 0.8rem;
		border-radius: 1.6rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(14, 14, 16, 0.95), rgba(8, 8, 10, 0.95));
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.24);
	}

	.pack-shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 1.05rem;
		background: #fff;
	}

	@media (min-width: 900px) {
		.gallery {
			grid-template-columns: 1.1fr 0.9fr 0.9fr;
			align-items: stretch;
		}

		.large {
			grid-row: span 2;
		}
	}
</style>
