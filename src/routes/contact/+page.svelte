<svelte:head>
	<title>Contact | Holograph</title>
	<meta name="description" content="Contact Christina for questions, feedback, or help with your order." />
</svelte:head>

<section class="section contact-page">
	<div class="page-wrap">
		<div class="glass-card contact-card">
			<p class="eyebrow">Contact</p>
			<h1>Feel free to reach out.</h1>
			<p>Questions, feedback, or help with your order.</p>
			<a class="button-primary" href="tel:3479960205">Christina · 347-996-0205</a>
		</div>
	</div>
</section>

<style>
	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 5vw, 3.4rem);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.96;
	}

	p {
		color: var(--muted);
		line-height: 1.6;
	}

	.contact-card {
		display: grid;
		gap: 0.9rem;
		padding: 1.4rem;
		max-width: 38rem;
	}
</style>
