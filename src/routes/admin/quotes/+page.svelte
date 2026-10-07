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
			<p>Quote alert: {quote.emailNotification === 'sent' ? 'sent' : quote.emailNotification === 'failed' ? 'failed' : 'not configured'}</p>
			{#if quote.websiteOrQr}<p>Website / QR: {quote.websiteOrQr}</p>{/if}
			{#if quote.designNotes}<p>{quote.designNotes}</p>{/if}
			{#if quote.artwork}<a href={`/admin/quote-artwork?pathname=${encodeURIComponent(quote.artwork.pathname)}`}>Download {quote.artwork.filename}</a>{/if}
		</article>
	{/each}
</div></section>

<style>
	.quotes { display:grid; gap:1rem; }
	h1,h2,p { margin:0; }
	h1,h2 { font-family:Georgia,serif; color:#2a1035; }
	p { color:#4b3651; line-height:1.55; }
	.quote {
		padding:1rem;
		border:1px solid #d0b2db;
		border-radius:1rem;
		background:#fffafd;
		display:grid;
		gap:.5rem;
	}
	a {
		color:#5d158d;
		font-weight:700;
		text-decoration:underline;
		text-underline-offset:.16em;
		overflow-wrap:anywhere;
	}
	a:hover { color:#3e075f; background:#f5e7ff; }
	a:focus-visible { outline:3px solid #087d97; outline-offset:3px; border-radius:.2rem; }
	.status {
		padding:.75rem 1rem;
		border:1px solid #9a68b0;
		border-left:4px solid #7828c7;
		border-radius:.7rem;
		background:#fffafd;
		color:#3c2145;
		font-weight:600;
		overflow-wrap:anywhere;
	}
	[role='alert'] { color:#8b142e; background:#fff0f3; border:1px solid #db7890; border-radius:.7rem; padding:.75rem 1rem; font-weight:650; overflow-wrap:anywhere; }
</style>
