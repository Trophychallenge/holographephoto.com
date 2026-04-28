<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section class="section final-cta">
	<div class="page-wrap">
		<div class="cta-card">
			<p class="eyebrow">Almost yours</p>
			<h2>Ready to make the magic?</h2>
			<div class="actions">
				<a class="button-primary" href="#preview-builder">Make The Magic</a>
				<a class="button-secondary" href={resolve('/prices')}>See Bundles</a>
			</div>
		</div>
	</div>
</section>

<style>
	.cta-card {
		display: grid;
		gap: 1rem;
		padding: 1.4rem;
		border-radius: 1.9rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			radial-gradient(circle at top, rgba(122, 240, 255, 0.12), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(14, 14, 16, 0.95), rgba(8, 8, 10, 0.96));
		box-shadow: 0 26px 60px rgba(0, 0, 0, 0.28);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.cta-card::before {
		content: '';
		position: absolute;
		inset: -30% auto auto -10%;
		width: 38%;
		height: 78%;
		background: radial-gradient(circle, rgba(122, 240, 255, 0.18), transparent 72%);
		pointer-events: none;
	}

	.cta-card::after {
		content: '';
		position: absolute;
		inset: auto -8% -28% auto;
		width: 36%;
		height: 68%;
		background: radial-gradient(circle, rgba(255, 111, 145, 0.15), transparent 72%);
		pointer-events: none;
	}

	h2 {
		margin: 0;
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 5vw, 3.2rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.8rem;
	}
</style>
