<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { orderStudioOpen } from '$lib/stores/order-studio';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/prices', label: 'Pricing' },
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
		<a
			class="button-primary header-cta"
			href="/?order=1"
			onclick={(event) => {
				if (window.location.pathname === '/') {
					event.preventDefault();
					orderStudioOpen.set(true);
				}
			}}
		>
			Start Order
		</a>
	</header>

	<main>
		{@render children()}
	</main>

	<footer class="site-footer">
		<div>
			<img class="footer-logo" src="/holographe/brand-logo.png" alt="Holographe logo" />
			<p class="footer-copy">Custom photo keepsakes made to feel easy to order and good to gift.</p>
		</div>
		<div class="footer-links">
			<a href={resolve('/prices')}>Pricing</a>
			<a href={resolve('/contact')}>Contact</a>
		</div>
		<div>
			<p class="footer-copy">admin@holographephoto.com</p>
			<p class="footer-meta">512-256-3720</p>
		</div>
	</footer>
</div>
