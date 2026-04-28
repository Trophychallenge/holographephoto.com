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
		{ href: '/gallery', label: 'Gallery' },
		{ href: '/contact', label: 'Contact' }
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

<div class="site-shell">
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<span class="brand-badge">
				<img class="brand-logo" src="/holographe/brand-logo.png" alt="Holographe logo" />
			</span>
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
			<a href={resolve('/contact')}>Contact</a>
		</div>
		<div>
			<p class="footer-copy">Christina</p>
			<p class="footer-meta">347-996-0205</p>
		</div>
	</footer>
</div>
