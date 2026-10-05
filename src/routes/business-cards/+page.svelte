<script lang="ts">
	let business = $state('');
	let name = $state('');
	let quantity = $state('100');
	let notes = $state('');
	let quoteReady = $state(false);
	const emailHref = $derived(
		`mailto:admin@holographephoto.com?${new URLSearchParams({
			subject: `Business card magnet quote — ${business || 'New inquiry'}`,
			body: `Hi Christina,\n\nI'd like a quote for holographic business card magnets.\n\nName: ${name}\nBusiness: ${business}\nQuantity: ${quantity}\nDetails, website/QR link, and event date: ${notes}\n\nI'll attach my logo or existing card design.\n`
		})}`
	);
</script>

<svelte:head>
	<title>Holographic Business Card Magnets | Holographe</title>
	<meta
		name="description"
		content="Custom holographic business card magnets for brands, events, and businesses. See a real Howdy Social order and request a tailored bulk quote."
	/>
</svelte:head>

<div class="business-page">
	<section class="brand-hero">
		<div class="hero-copy">
			<p class="eyebrow">Holographe for business</p>
			<h1>Make the first<br />impression <em>last.</em></h1>
			<p class="lead">Your logo. Your story. A little magnetic attraction.</p>
			<p>Turn your business card into a holographic magnet that deserves to stay on display.</p>
			<a class="button-primary" href="#request-quote"
				>Request your custom quote <span aria-hidden="true">↗</span></a
			>
			<div class="hero-details">
				<span>Custom design</span><span>Bulk orders</span><span>Your brand, in the light</span>
			</div>
		</div>
		<figure class="hero-media">
			<video
				src="/media/business/howdy-social.mp4"
				poster="/media/business/howdy-social.jpg"
				controls
				muted
				playsinline
				preload="metadata"
				aria-label="Real holographic business card magnets made for Howdy Social"
			></video>
			<figcaption><span>THE FINISHED PRODUCT</span> Made for Howdy Social</figcaption>
		</figure>
	</section>

	<section class="why-section" aria-labelledby="why-title">
		<div>
			<p class="eyebrow">Beyond the handoff</p>
			<h2 id="why-title">Give them something<br />worth holding onto.</h2>
		</div>
		<div class="benefits">
			<article>
				<span>01 / THE LOOK</span>
				<h3>Light-catching by design.</h3>
				<p>
					Holographic shimmer adds dimension to your branding. Dark contrasts and bright accents
					make the finish shine.
				</p>
			</article>
			<article>
				<span>02 / THE DETAILS</span>
				<h3>Built around your business.</h3>
				<p>
					Start with an existing card or a logo. Include your contact details, website, or a QR code
					to help people find you.
				</p>
			</article>
			<article>
				<span>03 / THE OCCASION</span>
				<h3>Ready for your next hello.</h3>
				<p>For local businesses, photographers, creators, client gifts, and event handouts.</p>
			</article>
		</div>
	</section>

	<section class="quote-section" id="request-quote" aria-labelledby="quote-title">
		<div class="quote-copy">
			<p class="eyebrow">Let's make yours</p>
			<h2 id="quote-title">Tell me about<br />your brand.</h2>
			<p>
				Every run is quoted for its quantity, design, and finish. Share what you have in mind and
				I'll help shape the details.
			</p>
			<ol>
				<li>Share your logo or current card.</li>
				<li>Review your quote and design details.</li>
				<li>Confirm your order before production.</li>
			</ol>
			<p class="small">
				Prefer to talk? <a href="tel:+15122563720">512-256-3720</a><br /><a
					href="mailto:admin@holographephoto.com">admin@holographephoto.com</a
				>
			</p>
		</div>
		<form
			class="quote-form"
			onsubmit={(event) => {
				event.preventDefault();
				quoteReady = true;
			}}
		>
			<label
				>Your name<input autocomplete="name" required maxlength="100" bind:value={name} /></label
			>
			<label
				>Business name<input
					autocomplete="organization"
					required
					maxlength="100"
					bind:value={business}
				/></label
			>
			<label
				>How many magnets?<select bind:value={quantity}
					><option>50</option><option>100</option><option>250</option><option>500</option><option
						>700</option
					><option>1,000+</option><option>Help me decide</option></select
				></label
			>
			<label
				>Design details<textarea
					rows="4"
					maxlength="1500"
					bind:value={notes}
					placeholder="Your website or QR destination, design ideas, and the date you need them."
				></textarea></label
			>
			<button type="submit" class="button-primary">Prepare my quote request</button>
			<p class="small">
				This prepares an email to Christina. Nothing is sent until you send it from your email app.
				Attach your artwork there.
			</p>
			{#if quoteReady}<div class="quote-ready" role="status">
					<p>Your request is ready.</p>
					<a class="button-secondary" href={emailHref}>Open email to send your request</a>
				</div>{/if}
		</form>
	</section>
</div>

<style>
	.business-page {
		width: min(1160px, calc(100% - 2rem));
		margin: 0 auto;
		padding: 2rem 0 4rem;
	}
	.brand-hero {
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: clamp(2rem, 7vw, 6rem);
		align-items: center;
		padding: clamp(1.5rem, 4vw, 3.5rem);
		border: 1px solid rgba(220, 197, 255, 0.23);
		border-radius: 2rem;
		background:
			radial-gradient(circle at 87% 14%, rgba(130, 235, 255, 0.18), transparent 27%),
			radial-gradient(circle at 13% 83%, rgba(255, 172, 214, 0.2), transparent 30%),
			linear-gradient(135deg, #311342, #101a3a 72%);
		box-shadow: 0 30px 80px rgba(5, 1, 20, 0.32);
	}
	h1,
	h2,
	h3 {
		font-family: Georgia, serif;
		font-weight: 500;
	}
	h1 {
		font-size: clamp(3rem, 6.3vw, 5.5rem);
		line-height: 1.02;
		letter-spacing: -0.045em;
		margin: 1.5rem 0;
	}
	h1 em {
		color: #dcc5f2;
		font-weight: 400;
	}
	h2 {
		font-size: clamp(2.2rem, 4vw, 3.6rem);
		letter-spacing: -0.04em;
		line-height: 1.1;
		margin: 1rem 0;
	}
	h3 {
		font-size: 1.6rem;
		line-height: 1.2;
		margin: 0.7rem 0;
	}
	p {
		color: var(--muted);
		line-height: 1.75;
	}
	.lead {
		font-size: 1.15rem;
		color: var(--text);
	}
	.hero-copy > p {
		max-width: 30rem;
	}
	.hero-copy > a {
		margin-top: 1rem;
		gap: 1.5rem;
	}
	.hero-details {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-top: 2rem;
		color: var(--muted);
		font-size: 0.78rem;
	}
	.hero-media {
		margin: 0;
		background: linear-gradient(135deg, #fff0d5, #e5c5f5 45%, #b8eaff);
		border: 1px solid rgba(255, 255, 255, 0.46);
		border-radius: 1.3rem;
		padding: 0.7rem;
	}
	video {
		display: block;
		width: 100%;
		aspect-ratio: 9/16;
		max-height: 36rem;
		object-fit: contain;
		border-radius: 0.7rem;
		background: #080808;
	}
	figcaption {
		display: grid;
		gap: 0.3rem;
		padding: 1rem 0.5rem;
		font-size: 0.85rem;
	}
	figcaption span,
	article > span {
		font-size: 0.65rem;
		letter-spacing: 0.16em;
		color: #c8b4dd;
	}
	.why-section {
		margin-top: 1.25rem;
		padding: clamp(2rem, 5vw, 4rem);
		border: 1px solid rgba(218, 199, 255, 0.16);
		border-radius: 1.75rem;
		background: linear-gradient(140deg, rgba(45, 18, 64, 0.86), rgba(15, 29, 56, 0.88));
	}
	.benefits {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-top: 2rem;
	}
	.quote-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(2rem, 6vw, 5rem);
		margin-top: 1.25rem;
		padding: clamp(1.5rem, 5vw, 4rem);
		border-radius: 1.75rem;
		background:
			radial-gradient(circle at 88% 16%, rgba(255, 174, 215, 0.34), transparent 28%),
			linear-gradient(135deg, #fff5e7, #f6e5f5 52%, #d9f6ff);
		color: #2a1835;
		scroll-margin-top: 2rem;
	}
	.quote-section h2,
	.quote-section p,
	.quote-section li,
	.quote-section label {
		color: #392442;
	}
	.quote-section .eyebrow {
		color: #59225d;
		border-color: rgba(103, 43, 106, 0.22);
		background: rgba(255, 255, 255, 0.46);
	}
	.quote-copy p {
		max-width: 29rem;
	}
	ol {
		padding-left: 1.2rem;
		color: var(--muted);
		line-height: 2;
	}
	.quote-form {
		display: grid;
		gap: 1.2rem;
		padding: clamp(1.2rem, 3vw, 2rem);
		background: #121115;
		border: 1px solid var(--line);
		border-radius: 1rem;
	}
	label {
		display: grid;
		gap: 0.5rem;
		font-size: 0.88rem;
	}
	input,
	select,
	textarea {
		width: 100%;
		background: #09090b;
		border: 1px solid #49424f;
		border-radius: 0.6rem;
		padding: 0.8rem;
		color: var(--text);
	}
	textarea {
		resize: vertical;
	}
	.small {
		font-size: 0.8rem;
		margin: 0;
		overflow-wrap: anywhere;
	}
	.small a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.quote-ready {
		display: grid;
		gap: 0.7rem;
		border-top: 1px solid var(--line);
		padding-top: 1rem;
	}
	.quote-ready p {
		margin: 0;
	}
	@media (max-width: 760px) {
		.brand-hero,
		.quote-section {
			grid-template-columns: 1fr;
		}
		.business-page {
			padding-top: 1rem;
		}
		.benefits {
			grid-template-columns: 1fr;
			gap: 1.4rem;
		}
		video {
			max-height: 28rem;
		}
		.hero-media {
			width: min(100%, 28rem);
			justify-self: center;
		}
	}
</style>
