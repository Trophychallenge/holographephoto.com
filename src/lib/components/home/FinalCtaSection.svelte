<script lang="ts">
</script>

<section class="section final-cta">
	<div class="page-wrap">
		<div class="cta-card">
			<p class="eyebrow">When You're Ready</p>
			<h2>Turn one favorite photo into a beautiful little gift.</h2>
			<p class="cta-copy">Start with the photo. Keep the rest simple.</p>
			<div class="cta-trust" aria-label="Order benefits">
				<span>Free shipping</span>
				<span>Secure Stripe checkout</span>
				<span>Gift-ready bundles</span>
			</div>
			<div class="actions">
				<a class="button-primary" href="#preview-builder">Create Yours</a>
				<a class="button-secondary" href="/prices">See Bundles</a>
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
		font-size: clamp(1.95rem, 4.4vw, 2.9rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.cta-copy {
		max-width: 28rem;
		margin: 0 auto;
		color: rgba(248, 244, 238, 0.74);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.8rem;
	}

	.cta-trust {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.6rem;
	}

	.cta-trust span {
		padding: 0.45rem 0.7rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.045);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(248, 244, 238, 0.82);
		font-size: 0.75rem;
	}
</style>
