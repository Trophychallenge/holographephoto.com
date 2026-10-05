<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	let menuOpen = $state(false);
	$effect(() => {
		page.url.pathname;
		menuOpen = false;
	});

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/collections/halloween', label: 'Halloween Edition' },
		{ href: '/customize', label: 'Custom' },
		{ href: '/business-cards', label: 'Business Cards' },
		{ href: '/prices', label: 'Pricing' },
		{ href: '/games/rival-quest', label: 'Games' },
		{ href: '/contact', label: 'Contact' }
	] as const;
	const startOrderHref = resolve('/customize');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Holographe</title>
	<meta name="description" content="Turn a favorite photo into a warm, light-catching keepsake." />
</svelte:head>

<div class="site-shell">
	<a class="skip-link" href="#main-content">Skip to content</a>
	<header class="site-header">
		<a class="brand-mark" href={resolve('/')}>
			<span class="brand-badge">
				<img class="brand-logo" src="/holographe/brand-wordmark-black-cropped.png" alt="Holographe logo" />
			</span>
		</a>
		<div class="header-cta-shell">
			<a class="button-primary header-cta" href={startOrderHref}> Start Order </a>
		</div>
		<button
			class="menu-toggle"
			type="button"
			aria-expanded={menuOpen}
			aria-controls="main-navigation"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{menuOpen ? 'Close' : 'Menu'}
		</button>
		<nav
			id="main-navigation"
			class="site-nav"
			class:menu-open={menuOpen}
			aria-label="Main navigation"
		>
			{#each navItems as item (item.href)}
				<a
					href={resolve(item.href)}
					aria-current={page.url.pathname === item.href ? 'page' : undefined}
					onclick={() => (menuOpen = false)}>{item.label}</a
				>
			{/each}
		</nav>
	</header>

	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div>
			<span class="brand-badge brand-badge-soft footer-brand-badge">
				<img class="footer-logo" src="/holographe/brand-wordmark-black-cropped.png" alt="Holographe logo" />
			</span>
			<p class="footer-copy">Photo keepsakes, seasonal decor, and creative games.</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/collections/halloween')}>Halloween Edition</a>
			<a href={resolve('/customize')}>Personalized Photo Magnets</a>
			<a href={resolve('/business-cards')}>Business Card Magnets</a>
			<a href={resolve('/prices')}>Pricing</a>
			<a href={resolve('/games/rival-quest')}>Games</a>
			<a href={resolve('/contact')}>Contact</a>
		</div>
		<div>
			<a class="footer-copy" href="mailto:admin@holographephoto.com">admin@holographephoto.com</a>
			<a class="footer-meta" href="tel:+15122563720">512-256-3720</a>
		</div>
	</footer>
</div>
