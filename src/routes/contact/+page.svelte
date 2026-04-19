<svelte:head>
	<title>Contact | Holographe</title>
	<meta
		name="description"
		content="Contact Holographe for custom quotes, event gifting, and higher-touch personalization requests."
	/>
</svelte:head>

<section class="section contact-page">
	<div class="page-wrap contact-layout">
		<section class="contact-hero glass-card">
			<div class="hero-copy">
				<p class="eyebrow">Private contact</p>
				<h1>Start with the essentials, and we can shape the rest around the moment.</h1>
				<p class="hero-subcopy">
					For larger orders, custom sentimental requests, or event gifting, this page should feel
					like a clean concierge entry point, not a clunky form dump.
				</p>

				<div class="hero-points">
					<div class="hero-point">
						<h2>What to send</h2>
						<p>Photo, occasion, name or date, timing, and anything emotionally important.</p>
					</div>
					<div class="hero-point">
						<h2>Best for</h2>
						<p>Weddings, memorials, holiday sets, milestone gifts, and larger curated bundles.</p>
					</div>
					<div class="hero-point">
						<h2>Response style</h2>
						<p>Clean, direct, and tailored to what you actually need instead of generic back-and-forth.</p>
					</div>
				</div>
			</div>

			<div class="contact-card">
				<p class="card-kicker">Direct line</p>
				<h2>hello@holographephoto.com</h2>
				<p>
					Send the essentials and we can guide the best format, quantity, and customization level
					for your order.
				</p>
				<div class="pill-row">
					<span>Photo</span>
					<span>Occasion</span>
					<span>Timeline</span>
					<span>Personal detail</span>
				</div>
			</div>
		</section>

		<section class="form-band glass-card">
			<div class="form-copy">
				<p class="eyebrow">Inquiry form</p>
				<h2>Keep it simple. We only need the right details.</h2>
				<p>
					This form is designed to feel polished and fast, with just enough structure to start a
					high-touch order.
				</p>
			</div>

			<form class="contact-form">
				<label>
					<span>Name</span>
					<input type="text" name="name" placeholder="Your name" />
				</label>
				<label>
					<span>Email</span>
					<input type="email" name="email" placeholder="you@example.com" />
				</label>
				<label>
					<span>Project type</span>
					<input
						type="text"
						name="project"
						placeholder="Wedding favors, memorial gift, anniversary set..."
					/>
				</label>
				<label>
					<span>Notes</span>
					<textarea
						name="details"
						rows="5"
						placeholder="Photo idea, quantity, personalization notes, deadline, or anything meaningful."
					></textarea>
				</label>
				<button type="submit" class="button-primary">Send inquiry</button>
			</form>
		</section>
	</div>
</section>

<style>
	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #f8f8f5;
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.9rem);
		line-height: 0.95;
		max-width: 12ch;
	}

	h2 {
		font-size: clamp(1.65rem, 3vw, 2.45rem);
		line-height: 0.98;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.contact-page {
		padding-top: 1.2rem;
	}

	.contact-layout,
	.contact-hero,
	.hero-copy,
	.hero-points,
	.contact-card,
	.form-band,
	.form-copy,
	.contact-form {
		display: grid;
		gap: 1rem;
	}

	.contact-layout {
		gap: 1.15rem;
	}

	.contact-hero,
	.form-band {
		grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
		padding: 1.15rem;
	}

	.hero-subcopy {
		max-width: 36rem;
		font-size: 1rem;
	}

	.hero-points {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.hero-point,
	.contact-card {
		padding: 0.95rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.hero-point h2 {
		font-size: 1rem;
	}

	.hero-point p {
		font-size: 0.88rem;
	}

	.contact-card {
		align-content: start;
		background:
			radial-gradient(circle at top left, rgba(122, 240, 255, 0.16), transparent 34%),
			radial-gradient(circle at bottom right, rgba(255, 111, 145, 0.14), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)),
			rgba(8, 16, 30, 0.76);
		border-color: rgba(255, 255, 255, 0.1);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.card-kicker,
	.contact-form span {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.pill-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.pill-row span {
		padding: 0.55rem 0.76rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.78rem;
		color: rgba(248, 248, 244, 0.86);
	}

	.form-copy {
		align-content: start;
	}

	.contact-form label {
		display: grid;
		gap: 0.5rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text);
	}

	@media (max-width: 960px) {
		.contact-hero,
		.form-band,
		.hero-points {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		h1 {
			font-size: clamp(2rem, 9vw, 2.8rem);
		}

		h2 {
			font-size: clamp(1.45rem, 6vw, 2rem);
		}

		.contact-hero,
		.form-band {
			padding: 0.9rem;
		}
	}
</style>
