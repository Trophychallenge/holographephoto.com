<svelte:head>
	<title>Contact | Holographe</title>
	<meta
		name="description"
		content="Contact Holographe to start an order for a personalized holographic photo magnet."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap contact-layout">
		<div class="section-head">
			<span class="eyebrow">Contact</span>
			<h1>Start your order.</h1>
			<p>Share the photo, the occasion, and any personal details you want added.</p>
			<div class="contact-notes glass-card">
				<p>Email: hello@holographephoto.com</p>
				<p>Website: holographephoto.com</p>
				<p>Best starting point: photo, occasion, and personalization.</p>
			</div>
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
				Product type
				<input
					type="text"
					name="project"
					placeholder="Photo only, photo + handwriting, photo + drawing..."
				/>
			</label>
			<label>
				Order details
				<textarea
					name="details"
					rows="6"
					placeholder="Tell me about the photo, the occasion, the message or drawing you want added, and your timeline."
				></textarea>
			</label>
			<button type="submit" class="button-primary">Send order inquiry</button>
		</form>
	</div>
</section>

<style>
	h1 {
		margin: 1rem 0 0.8rem;
		line-height: 0.96;
		letter-spacing: -0.04em;
		font-weight: 500;
		font-size: clamp(2.2rem, 5vw, 3.4rem);
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.contact-layout {
		display: grid;
		grid-template-columns: 0.95fr 1.05fr;
		gap: 1.5rem;
	}

	.contact-notes,
	.contact-form {
		padding: 1.2rem;
	}

	.contact-notes {
		display: grid;
		gap: 0.8rem;
		margin-top: 1.2rem;
	}

	.contact-form {
		display: grid;
		gap: 1rem;
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
		.contact-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
