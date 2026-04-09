<script lang="ts">
	import { resolve } from '$app/paths';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/technology', label: 'Technology' },
		{ href: '/formats', label: 'Formats' },
		{ href: '/gallery', label: 'Gallery' },
		{ href: '/contact', label: 'Contact' }
	] as const;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Holographe</title>
	<meta
		name="description"
		content="Holographe creates elevated holographic photo experiences for events, retail, and premium brand storytelling."
	/>
</svelte:head>

<div class="site-shell">
	<div class="ambient ambient-a"></div>
	<div class="ambient ambient-b"></div>
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<span class="brand-kicker">Holographe</span>
			<span class="brand-name">Holographic Photo Experiences</span>
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
				Cinematic holographic photo installations for launches, galleries, weddings, and luxury
				events.
			</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/technology')}>Technology</a>
			<a href={resolve('/formats')}>Formats</a>
			<a href={resolve('/gallery')}>Gallery</a>
			<a href={resolve('/contact')}>Book a consultation</a>
		</div>
		<p class="footer-meta">holographephoto.com</p>
	</footer>
</div>
