<section class="business-feature" aria-labelledby="business-feature-title">
	<div class="business-copy">
		<p class="eyebrow">For brands worth remembering</p>
		<h2 id="business-feature-title">A business card<br />they keep.</h2>
		<p>
			Give your brand a place on the fridge. Custom holographic business card magnets catch the
			light long after the first hello.
		</p>
		<a class="button-primary" href="/business-cards"
			>Explore business card magnets <span aria-hidden="true">↗</span></a
		>
		<span class="business-credit">Featuring a real order for Howdy Social</span>
	</div>
	<figure>
		<video
			src="/media/business/howdy-social.mp4"
			poster="/media/business/howdy-social-closeup-poster.jpg"
			controls
			muted
			playsinline
			preload="none"
			aria-label="Howdy Social holographic business card magnets catching the light"
		></video>
		<figcaption>Real magnets. Real shimmer.</figcaption>
	</figure>
</section>

<style>
	.business-feature {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr 0.85fr;
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
		width: min(1120px, calc(100% - 2rem));
		margin: 4rem auto 0;
		padding: clamp(1.5rem, 4vw, 3rem);
		border-block: 1px solid var(--line);
		background: radial-gradient(ellipse at 90% 60%, #191728, transparent 60%);
	}
	h2 {
		margin: 1rem 0;
		font:
			500 clamp(2.5rem, 5vw, 4.5rem)/1.05 Georgia,
			serif;
		letter-spacing: -0.045em;
	}
	p:not(.eyebrow) {
		max-width: 32rem;
		color: var(--muted);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}
	.business-credit {
		display: block;
		margin-top: 1rem;
		font-size: 0.8rem;
		color: var(--muted);
	}
	figure {
		margin: 0;
	}
	video {
		display: block;
		width: 100%;
		max-height: 32rem;
		aspect-ratio: 9/16;
		object-fit: contain;
		background: #070707;
		border-radius: 1rem;
		border: 1px solid var(--line);
	}
	figcaption {
		margin-top: 0.8rem;
		font-size: 0.75rem;
		color: var(--muted);
		text-align: center;
	}
	@media (max-width: 700px) {
		.business-feature {
			grid-template-columns: 1fr;
		}
		video {
			max-height: 26rem;
		}
	}
</style>
