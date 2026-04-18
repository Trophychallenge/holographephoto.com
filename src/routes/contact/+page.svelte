<svelte:head>
	<title>Contact | Holographe</title>
	<meta
		name="description"
		content="Contact Holographe with your photo, personalization ideas, and timing."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap contact-layout">
		<div class="section-head center">
			<span class="eyebrow">Contact</span>
			<h1>Send the essentials.</h1>
			<p>Photo, occasion, and personalization idea. That is enough to start.</p>
		</div>

		<div class="contact-grid">
			<div class="glass-card info-card">
				<p class="info-kicker">Best way to start</p>
				<h2>Email or message with the basics.</h2>
				<div class="info-pills">
					<span>Photo</span>
					<span>Occasion</span>
					<span>Name or date</span>
					<span>Timeline</span>
				</div>
				<p class="contact-line">hello@holographephoto.com</p>
			</div>

			<form class="glass-card contact-form">
				<label>
					Name
					<input type="text" name="name" placeholder="Your name" />
				</label>
				<label>
					Email
					<input type="email" name="email" placeholder="you@example.com" />
				</label>
				<label>
					Idea
					<input
						type="text"
						name="project"
						placeholder="Couple photo, pet memorial, baby gift..."
					/>
				</label>
				<label>
					Notes
					<textarea name="details" rows="5" placeholder="Short note, date, overlay idea, or timing."
					></textarea>
				</label>
				<button type="submit" class="button-primary">Send inquiry</button>
			</form>
		</div>
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
	}

	h1 {
		font-size: clamp(2.3rem, 5vw, 3.8rem);
	}

	h2 {
		font-size: clamp(1.7rem, 4vw, 2.5rem);
	}

	p {
		color: var(--muted);
		line-height: 1.65;
	}

	.center {
		text-align: center;
		margin-inline: auto;
	}

	.contact-layout,
	.contact-grid,
	.info-card,
	.contact-form {
		display: grid;
		gap: 1rem;
	}

	.contact-grid {
		grid-template-columns: 0.9fr 1.1fr;
	}

	.info-card,
	.contact-form {
		padding: 1.2rem;
	}

	.info-kicker {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.18em;
		color: var(--accent);
		font-weight: 700;
	}

	.info-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
	}

	.info-pills span {
		padding: 0.65rem 0.85rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: var(--text);
	}

	.contact-line {
		font-size: 1.1rem;
		color: var(--text);
	}

	label {
		display: grid;
		gap: 0.55rem;
		font-size: 0.95rem;
		color: var(--text);
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

	@media (max-width: 900px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
