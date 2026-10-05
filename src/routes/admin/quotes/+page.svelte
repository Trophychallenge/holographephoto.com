<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Admin Quote Requests | Holographe</title><meta name="robots" content="noindex, nofollow" /></svelte:head>

<section class="section"><div class="page-wrap quotes">
	<p class="eyebrow">Admin</p><h1>Business-card quote requests</h1>
	<p class="status">Private quote storage: {data.storageConfigured ? 'configured' : 'needs QUOTE_BLOB_READ_WRITE_TOKEN for a dedicated private Blob store'} · Quote alerts: {data.notificationsConfigured ? 'configured' : 'not configured'}</p>
	{#if data.loadError}<p role="alert">{data.loadError}</p>{/if}
	{#if data.quotes.length === 0}<p>No quote requests yet.</p>{/if}
	{#each data.quotes as quote (quote.id)}
		<article class="quote"><h2>{quote.businessName}</h2><p>{quote.name} · <a href={`mailto:${quote.email}`}>{quote.email}</a></p><p>Reference: {quote.id}</p><p>Quantity: {quote.quantity}{quote.neededBy ? ` · Needed by ${quote.neededBy}` : ''}</p>
			{#if quote.websiteOrQr}<p>Website / QR: {quote.websiteOrQr}</p>{/if}
			{#if quote.designNotes}<p>{quote.designNotes}</p>{/if}
			{#if quote.artwork}<a href={`/admin/quote-artwork?pathname=${encodeURIComponent(quote.artwork.pathname)}`}>Download {quote.artwork.filename}</a>{/if}
		</article>
	{/each}
</div></section>

<style>
	.quotes { display:grid; gap:1rem; } h1,h2,p { margin:0; } h1,h2 { font-family:Georgia,serif; } .quote { padding:1rem; border:1px solid var(--line); border-radius:1rem; background:var(--panel); display:grid; gap:.5rem; } a { color:var(--accent-3); overflow-wrap:anywhere; } .status { padding:.75rem 1rem; border-left:3px solid var(--accent-3); background:var(--panel); }
</style>
