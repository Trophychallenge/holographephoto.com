<section class="section how-section">
	<div class="page-wrap how-layout">
		<div class="heading">
			<p class="eyebrow">How it works</p>
			<h2>Simple from the start.</h2>
			<p>Photo in, preview on, order placed.</p>
		</div>

		<ol class="steps">
			<li>
				<span>01</span>
				<h3>Upload your photo</h3>
			</li>
			<li>
				<span>02</span>
				<h3>Preview the shimmer</h3>
			</li>
			<li>
				<span>03</span>
				<h3>Receive your keepsake</h3>
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
	p,
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
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.98;
	}

	p {
		color: rgba(234, 234, 230, 0.68);
	}

	.steps {
		padding: 0;
		list-style: none;
	}

	.steps li {
		display: grid;
		gap: 0.45rem;
		padding: 1.15rem;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(15, 15, 17, 0.95), rgba(8, 8, 10, 0.95));
		text-align: center;
	}

	.steps span {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(236, 236, 232, 0.56);
	}

	h3 {
		font-size: 1.35rem;
	}

	@media (min-width: 860px) {
		.steps {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
