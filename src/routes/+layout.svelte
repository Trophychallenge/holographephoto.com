<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/technology', label: 'Product' },
		{ href: '/formats', label: 'Personalization' },
		{ href: '/gallery', label: 'Gallery' },
		{ href: '/contact', label: 'Contact' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Holographe</title>
	<meta
		name="description"
		content="Holographe creates premium personalized holographic photo magnets with optional handwritten or illustrated add-ons."
	/>
</svelte:head>

<div class="site-shell">
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<span class="brand-kicker">Holographe</span>
			<span class="brand-name">Personalized Holographic Photo Magnets</span>
		</a>
		<nav class="site-nav" aria-label="Main navigation">
			{#each navItems as item (item.href)}
				<a href={resolve(item.href)}>{item.label}</a>
			{/each}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-footer">
		<div>
			<p class="footer-title">Holographe</p>
			<p class="footer-copy">
				Premium holographic photo magnets with optional personal handwriting and drawn details, made
				to feel giftable, display-worthy, and personal.
			</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/technology')}>Product</a>
			<a href={resolve('/formats')}>Personalization</a>
			<a href={resolve('/gallery')}>Gallery</a>
			<a href={resolve('/contact')}>Start your order</a>
		</div>
		<p class="footer-meta">holographephoto.com</p>
	</footer>
</div>
