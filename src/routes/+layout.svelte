<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/customize', label: 'Customize' },
		{ href: '/prices', label: 'Prices' },
		{ href: '/gallery', label: 'Gallery' },
		{ href: '/contact', label: 'Contact' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Holographe</title>
	<meta
		name="description"
		content="Create a premium holographic keepsake from your favorite photo, add a personal overlay, and order it gift-ready in minutes."
	/>
</svelte:head>

<div class="site-shell">
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<span class="brand-kicker">Holographe</span>
			<span class="brand-name">Custom keepsakes in light</span>
		</a>
		<nav class="site-nav" aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a href={resolve(item.href)}>{item.label}</a>
			{/each}
		</nav>
		<a class="button-primary header-cta" href="/#preview-builder">Create Yours</a>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-footer">
		<div>
			<p class="footer-title">Holographe</p>
			<p class="footer-copy">
				Quietly luxurious holographic keepsakes for the photos you keep returning to.
			</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/customize')}>Customize</a>
			<a href={resolve('/prices')}>Prices</a>
			<a href={resolve('/gallery')}>Gallery</a>
			<a href={resolve('/contact')}>Start your order</a>
		</div>
		<p class="footer-meta">holographephoto.com</p>
	</footer>
</div>
