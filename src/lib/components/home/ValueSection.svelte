<section class="section value-section">
	<div class="page-wrap value-layout">
		<div class="section-head">
			<p class="eyebrow">Some memories belong together</p>
			<h2>Better together.</h2>
		</div>

		<div class="value-grid">
			<div class="value-card glass-card">
				<span>1 Holographe</span>
				<strong>$15</strong>
			</div>
			<div class="value-card glass-card">
				<span>Set of 3</span>
				<strong>$30</strong>
			</div>
			<div class="value-card glass-card">
				<span>Family Set</span>
				<strong>$60</strong>
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
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
		color: rgba(236, 228, 216, 0.58);
	}

	.value-card strong {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		line-height: 1;
		color: #f6f0e9;
	}

	@media (max-width: 760px) {
		.value-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
