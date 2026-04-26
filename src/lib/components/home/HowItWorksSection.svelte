<section class="section how-section" id="how-it-works">
	<div class="page-wrap how-layout">
		<div class="heading">
			<p class="eyebrow">How it works</p>
			<h2>Three simple steps.</h2>
		</div>

		<ol class="steps">
			<li>
				<div class="icon-shell">01</div>
				<h3>Upload your photo</h3>
			</li>
			<li>
				<div class="icon-shell">02</div>
				<h3>Add holographic magic</h3>
			</li>
			<li>
				<div class="icon-shell">03</div>
				<h3>Receive gift-ready magnet</h3>
			</li>
		</ol>
	</div>
</section>

<style>
	.how-layout,
	.heading,
	.steps {
		display: grid;
		gap: 1rem;
	}

	.heading {
		text-align: center;
		justify-items: center;
	}

	h2,
	h3,
	ol {
		margin: 0;
	}

	h2,
	h3 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		color: #f8f8f4;
		letter-spacing: -0.04em;
	}

	h2 {
		font-size: clamp(1.9rem, 5vw, 2.8rem);
		line-height: 0.98;
	}

	h3 {
		font-size: 1.1rem;
		line-height: 1.1;
	}

	.steps {
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.steps li {
		display: grid;
		justify-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 1.4rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(15, 15, 17, 0.95), rgba(8, 8, 10, 0.95));
		text-align: center;
	}

	.icon-shell {
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(122, 240, 255, 0.18), rgba(255, 255, 255, 0.06));
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #fff;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
	}

	@media (max-width: 860px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
