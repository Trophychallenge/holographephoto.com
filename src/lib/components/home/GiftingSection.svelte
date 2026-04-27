<script lang="ts">
	let sendAsGift = $state(true);
</script>

<section class="section gifting-section">
	<div class="page-wrap gifting-layout">
		<div class="gift-visual glass-card">
			<div class="envelope-stage">
				<div class="envelope"></div>
				<div class="ribbon ribbon-h"></div>
				<div class="ribbon ribbon-v"></div>
				<div class="card"></div>
			</div>
		</div>

		<div class="gift-copy">
			<p class="eyebrow">Already gift-ready</p>
			<h2>Finished with a black envelope and white ribbon.</h2>
			<p>Ready to give.</p>
			<p>No wrapping needed.</p>

			<label class="gift-toggle">
				<input type="checkbox" bind:checked={sendAsGift} />
				<span>Send as a gift</span>
			</label>

			{#if sendAsGift}
				<div class="gift-options">
					<span>Include message</span>
					<span>Ship directly</span>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.gifting-layout {
		display: grid;
		gap: 1rem;
		align-items: center;
	}

	.gift-copy {
		display: grid;
		gap: 0.8rem;
		max-width: 24rem;
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.9rem, 5vw, 2.8rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f6f0e9;
	}

	p {
		color: rgba(236, 228, 216, 0.72);
	}

	.gift-visual {
		padding: 1rem;
	}

	.envelope-stage {
		position: relative;
		min-height: 18rem;
		border-radius: 1.4rem;
		background:
			radial-gradient(circle at top, rgba(234, 211, 182, 0.08), transparent 34%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
		overflow: hidden;
	}

	.envelope {
		position: absolute;
		inset: 24% 18% 18% 18%;
		border-radius: 1rem;
		background: linear-gradient(180deg, #101113, #050506);
		box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28);
	}

	.ribbon {
		position: absolute;
		background: rgba(255, 255, 255, 0.92);
	}

	.ribbon-h {
		left: 18%;
		right: 18%;
		top: 50%;
		height: 0.45rem;
		transform: translateY(-50%);
	}

	.ribbon-v {
		top: 24%;
		bottom: 18%;
		left: 50%;
		width: 0.45rem;
		transform: translateX(-50%);
	}

	.card {
		position: absolute;
		left: 50%;
		top: 15%;
		width: 32%;
		aspect-ratio: 4 / 5;
		transform: translateX(-50%) rotate(-3deg);
		border-radius: 1rem;
		background:
			linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(241, 218, 186, 0.18), rgba(207, 220, 255, 0.14)),
			url('/holographe/jessholo.png') center / cover no-repeat;
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow: 0 18px 36px rgba(0, 0, 0, 0.24);
	}

	.gift-toggle {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		color: #f8f8f4;
		font-weight: 600;
	}

	.gift-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.gift-options span {
		padding: 0.48rem 0.7rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: rgba(236, 236, 232, 0.74);
		font-size: 0.78rem;
	}

	@media (min-width: 980px) {
		.gifting-layout {
			grid-template-columns: minmax(18rem, 0.95fr) minmax(0, 1.05fr);
		}
	}
</style>
