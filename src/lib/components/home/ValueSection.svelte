<section class="section value-section">
	<div class="page-wrap value-layout">
		<div class="section-head">
			<p class="eyebrow">Better together</p>
			<h2>Simple pricing.</h2>
		</div>

		<div class="value-grid">
			<div class="value-card glass-card">
				<span>1 for</span>
				<strong>$15</strong>
			</div>
			<div class="value-card glass-card">
				<span>3 for</span>
				<strong>$30</strong>
			</div>
		</div>
	</div>
</section>

<style>
	.value-layout,
	.value-grid {
		display: grid;
		gap: 1rem;
	}

	.value-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.value-card {
		display: grid;
		gap: 0.35rem;
		padding: 1rem;
		text-align: center;
	}

	.value-card span {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: rgba(236, 236, 232, 0.58);
	}

	.value-card strong {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1;
		color: #f8f8f4;
	}

	@media (max-width: 640px) {
		.value-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
