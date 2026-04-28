<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/prices', label: 'Prices' },
		{ href: '/gallery', label: 'Gallery' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Holograph</title>
	<meta
		name="description"
		content="Turn a favorite photo into a warm, light-catching keepsake."
	/>
</svelte:head>

<div class="site-shell" id="site-top">
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<img class="brand-logo" src="/holographe/brand-logo.png" alt="Holographe logo" />
			<span class="brand-name">Made from your photo</span>
		</a>
		<nav class="site-nav" aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a href={resolve(item.href)}>{item.label}</a>
			{/each}
		</nav>
		<a class="button-primary header-cta" href="/#preview-builder">Make The Magic</a>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-footer">
		<div>
			<img class="footer-logo" src="/holographe/brand-logo.png" alt="Holographe logo" />
			<p class="footer-copy">Little keepsakes for big family moments.</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/prices')}>Prices</a>
			<a href={resolve('/gallery')}>Gallery</a>
			<a href="#contact-modal">Call Christina</a>
		</div>
		<p class="footer-meta">holographephoto.com</p>
	</footer>
</div>

<div class="modal-shell" id="contact-modal">
	<a class="modal-backdrop" href="#site-top" aria-label="Close contact details"></a>
	<div class="modal-card contact-modal-card">
		<a class="modal-close" href="#site-top" aria-label="Close contact details">Close</a>
		<p class="modal-kicker">Contact Christina</p>
		<strong class="modal-title">347-996-0205</strong>
		<p class="modal-copy">Feel free to reach out for any feedback.</p>
		<a class="button-primary modal-action" href="tel:3479960205">Call Now</a>
	</div>
</div>
