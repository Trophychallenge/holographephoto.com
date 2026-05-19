<svelte:head>
	<title>Contact | Holograph</title>
	<meta name="description" content="Contact us for questions, feedback, or help with your order." />
</svelte:head>

<section class="section contact-page">
	<div class="page-wrap">
		<section class="glass-card contact-card">
			<div class="contact-glow" aria-hidden="true"></div>
			<div class="contact-copy">
				<p class="eyebrow">Contact</p>
				<h1>Need help with an order, a gift, or a custom request?</h1>
				<p>Reach us directly.</p>
			</div>

			<div class="contact-actions">
				<a class="contact-action contact-action-primary" href="tel:5122563720">
					<span class="contact-label">Call or text</span>
					<strong>512-256-3720</strong>
				</a>
				<a class="contact-action" href="mailto:admin@holographephoto.com">
					<span class="contact-label">Email</span>
					<strong>admin@holographephoto.com</strong>
				</a>
			</div>

			<div class="contact-notes" aria-label="What we can help with">
				<span>Order help</span>
				<span>Gift questions</span>
				<span>Bulk requests</span>
			</div>
		</section>
	</div>
</section>

<style>
	h1,
	strong,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(1.9rem, 5vw, 3rem);
		font-weight: 500;
		letter-spacing: -0.05em;
		line-height: 0.96;
		color: #faf7f1;
		text-wrap: balance;
	}

	p {
		color: var(--muted);
		line-height: 1.55;
	}

	.contact-card {
		display: grid;
		gap: 1rem;
		padding: 1.2rem;
		max-width: 38rem;
		position: relative;
		overflow: hidden;
	}

	.contact-glow {
		position: absolute;
		inset: auto -10% -30% auto;
		width: 14rem;
		height: 14rem;
		border-radius: 999px;
		background:
			radial-gradient(circle, rgba(234, 211, 182, 0.22), rgba(234, 211, 182, 0.04) 42%, transparent 68%);
		filter: blur(18px);
		pointer-events: none;
	}

	.contact-copy {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.55rem;
		max-width: 24rem;
	}

	.contact-actions {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.contact-action {
		display: grid;
		gap: 0.3rem;
		padding: 1rem;
		border-radius: 1.15rem;
		border: 1px solid rgba(255, 255, 255, 0.09);
		background:
			linear-gradient(160deg, rgba(18, 18, 18, 0.9), rgba(10, 10, 10, 0.85)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.08), transparent 34%);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.06),
			0 18px 40px rgba(0, 0, 0, 0.16);
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease;
	}

	.contact-action:hover {
		transform: translateY(-2px);
		border-color: rgba(234, 211, 182, 0.2);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 22px 48px rgba(0, 0, 0, 0.2);
	}

	.contact-action-primary {
		background:
			linear-gradient(160deg, rgba(30, 25, 20, 0.9), rgba(11, 11, 11, 0.85)),
			radial-gradient(circle at top left, rgba(234, 211, 182, 0.14), transparent 38%);
	}

	.contact-label {
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.58);
	}

	strong {
		font-size: 1rem;
		font-weight: 600;
		color: #faf7f1;
		letter-spacing: -0.02em;
	}

	.contact-notes {
		position: relative;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.contact-notes span {
		padding: 0.42rem 0.68rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.68rem;
		color: rgba(247, 243, 238, 0.8);
	}

	@media (max-width: 640px) {
		.contact-card {
			padding: 1rem;
		}

		.contact-actions {
			grid-template-columns: 1fr;
		}

		.contact-action {
			padding: 0.95rem;
		}
	}
</style>
