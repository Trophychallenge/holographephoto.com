<section class="section how-section">
	<div class="page-wrap how-layout">
		<div class="heading">
			<p class="eyebrow">How it works</p>
			<h2>Three simple steps.</h2>
		</div>

		<ol class="steps">
			<li>
				<span>01</span>
				<h3>Pick a photo</h3>
				<p>Use your favorite shot.</p>
			</li>
			<li>
				<span>02</span>
				<h3>Make it yours</h3>
				<p>Add a name, date, or overlay.</p>
			</li>
			<li>
				<span>03</span>
				<h3>Order the bundle</h3>
				<p>Checkout on-site with the sale pricing.</p>
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

	h3 {
		font-size: 1.45rem;
	}

	p {
		color: rgba(234, 234, 230, 0.7);
		line-height: 1.65;
	}

	.steps {
		padding: 0;
		list-style: none;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.steps li {
		display: grid;
		gap: 0.55rem;
		padding: 1.15rem;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(15, 15, 17, 0.95), rgba(8, 8, 10, 0.95));
		text-align: center;
		position: relative;
		overflow: hidden;
		transition:
			transform 220ms ease,
			box-shadow 220ms ease,
			border-color 220ms ease;
	}

	.steps li:hover {
		transform: translateY(-4px);
		box-shadow: 0 28px 58px rgba(0, 0, 0, 0.3);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.steps li::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 34%);
		opacity: 0.6;
		pointer-events: none;
	}

	.steps span {
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--accent);
	}

	@media (max-width: 860px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}
</style>
