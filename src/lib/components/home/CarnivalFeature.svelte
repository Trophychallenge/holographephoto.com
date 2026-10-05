<section class="carnival-feature" aria-labelledby="carnival-title">
	<figure>
		<video
			src="/media/halloween/creepy-carnival.mp4"
			poster="/media/halloween/creepy-carnival.jpg"
			muted
			controls
			playsinline
			preload="none"
			aria-label="Creepy Carnival holographic dishwasher mural in the light"
		></video>
		<figcaption>The Creepy Carnival mural, filmed in the light.</figcaption>
	</figure>
	<div class="carnival-copy">
		<p class="eyebrow">Step right up</p>
		<h2 id="carnival-title">The kitchen has<br />a dark side.</h2>
		<p>
			Meet Creepy Carnival. A holographic magnetic mural that turns an everyday surface into the
			main attraction.
		</p>
		<a class="button-primary" href="/collections/halloween#design-heading"
			>Choose your Halloween design <span aria-hidden="true">→</span></a
		>
	</div>
</section>

<style>
	.carnival-feature {
		display: grid;
		grid-template-columns: 0.85fr 1fr;
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
		width: min(1120px, calc(100% - 2rem));
		margin: 3rem auto;
		padding: clamp(1.5rem, 4vw, 3rem);
		border: 1px solid #eac38f25;
		border-radius: 1.5rem;
		background: radial-gradient(ellipse at 15% 70%, #2a1426, #0b0b0f 70%);
		position: relative;
		z-index: 1;
	}
	figure {
		margin: 0;
	}
	video {
		width: 100%;
		display: block;
		aspect-ratio: 9/16;
		max-height: 30rem;
		object-fit: contain;
		background: #060607;
		border-radius: 0.8rem;
	}
	figcaption {
		font-size: 0.92rem;
		font-weight: 600;
		margin-top: 0.8rem;
		color: var(--muted);
	}
	h2 {
		font:
			500 clamp(2.4rem, 5vw, 4rem)/1.05 Georgia,
			serif;
		letter-spacing: -0.04em;
		margin: 1rem 0;
	}
	p:not(.eyebrow) {
		color: var(--muted);
		line-height: 1.7;
		margin-bottom: 1.5rem;
	}
	@media (max-width: 700px) {
		.carnival-feature {
			grid-template-columns: 1fr;
		}
		.carnival-copy {
			grid-row: 1;
		}
		video {
			max-height: 26rem;
		}
	}
</style>
