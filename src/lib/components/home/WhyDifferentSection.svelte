<script lang="ts">
	const items = [
		{
			title: 'Easy to send',
			copy: 'Simple bundles and a quick finish.',
			mark: '01'
		},
		{
			title: 'Made from your photo',
			copy: 'The details stay personal.',
			mark: '02'
		},
		{
			title: 'Feels like a gift',
			copy: 'Small, bright, and easy to keep close.',
			mark: '03'
		}
	];
</script>

<section class="section why-section">
	<div class="page-wrap why-layout">
		<div class="section-head">
			<p class="eyebrow">Why It Lands</p>
			<h2>Thoughtful without feeling heavy.</h2>
		</div>

		<div class="why-grid">
			{#each items as item (item.title)}
				<article class="why-card glass-card">
					<div class="mark">{item.mark}</div>
					<h3>{item.title}</h3>
					<p>{item.copy}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.why-layout,
	.why-grid {
		display: grid;
		gap: 1rem;
	}

	.why-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	h3 {
		margin: 0;
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: 1.12rem;
		line-height: 1.12;
		letter-spacing: -0.04em;
		color: #f6f0e9;
	}

	p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: rgba(247, 243, 238, 0.72);
	}

	.why-card {
		display: grid;
		gap: 0.7rem;
		padding: 1.1rem;
		text-align: left;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(16, 16, 16, 0.92), rgba(8, 8, 8, 0.95));
	}

	.mark {
		display: inline-flex;
		width: fit-content;
		padding: 0.35rem 0.55rem;
		border-radius: 999px;
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		font-weight: 700;
		color: #ead3b6;
		border: 1px solid rgba(234, 211, 182, 0.2);
		background: rgba(234, 211, 182, 0.06);
	}

	@media (max-width: 860px) {
		.why-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
