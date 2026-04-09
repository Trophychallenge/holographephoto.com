<svelte:head>
	<title>Contact | Holographe</title>
	<meta
		name="description"
		content="Contact Holographe to discuss event installations, commissions, or holographic brand activations."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap contact-layout">
		<div class="section-head">
			<span class="eyebrow">Contact</span>
			<h1>Let&apos;s shape the right format for the project.</h1>
			<p>
				Use this page as your intake point for events, commissions, retail displays, and creative
				collaborations.
			</p>
			<div class="contact-notes glass-card">
				<p>Email: hello@holographephoto.com</p>
				<p>Website: holographephoto.com</p>
				<p>Typical first step: a short creative consultation and scope review.</p>
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
				Project type
				<input type="text" name="project" placeholder="Event, portrait, retail, activation..." />
			</label>
			<label>
				Project details
				<textarea
					name="details"
					rows="6"
					placeholder="Tell me about the audience, venue, timeline, and what you want the piece to feel like."
				></textarea>
			</label>
			<button type="submit" class="button-primary">Send inquiry</button>
		</form>
	</div>
</section>

<style>
	h1 {
		margin: 1rem 0 0.8rem;
		line-height: 0.96;
		letter-spacing: -0.04em;
		font-weight: 500;
		font-size: clamp(3rem, 7vw, 5.1rem);
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.75;
	}

	.contact-layout {
		display: grid;
		grid-template-columns: 0.95fr 1.05fr;
		gap: 1.5rem;
	}

	.contact-notes,
	.contact-form {
		padding: 1.6rem;
	}

	.contact-notes {
		display: grid;
		gap: 0.8rem;
		margin-top: 2rem;
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
