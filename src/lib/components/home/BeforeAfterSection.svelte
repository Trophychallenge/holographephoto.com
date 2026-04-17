<script lang="ts">
	type CompareUpload = 'before' | 'after';

	let beforeSrc = $state('');
	let beforeName = $state('');
	let afterSrc = $state('');
	let afterName = $state('');

	let beforeInput: HTMLInputElement | null = null;
	let afterInput: HTMLInputElement | null = null;

	function updateUploadedImage(event: Event, type: CompareUpload) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const nextUrl = URL.createObjectURL(file);

		if (type === 'before') {
			if (beforeSrc) URL.revokeObjectURL(beforeSrc);
			beforeSrc = nextUrl;
			beforeName = file.name;
		} else {
			if (afterSrc) URL.revokeObjectURL(afterSrc);
			afterSrc = nextUrl;
			afterName = file.name;
		}

		input.value = '';
	}

	function clearUploadedImage(type: CompareUpload) {
		if (type === 'before' && beforeSrc) {
			URL.revokeObjectURL(beforeSrc);
			beforeSrc = '';
			beforeName = '';
		}

		if (type === 'after' && afterSrc) {
			URL.revokeObjectURL(afterSrc);
			afterSrc = '';
			afterName = '';
		}
	}
</script>

<section class="section comparison">
	<div class="page-wrap compare-layout">
		<div class="copy">
			<p class="eyebrow">Before and after</p>
			<h2>Upload your own comparison.</h2>
			<p>
				Use your own original image and your own finished holographic shot here. This section stays
				clean until you have real examples to show.
			</p>
		</div>

		<div class="compare-grid">
			<article class="compare-card">
				<div class="card-head">
					<p class="card-label">Before</p>
					<button type="button" class="soft-button" onclick={() => beforeInput?.click()}>
						Upload before
					</button>
				</div>
				<input
					bind:this={beforeInput}
					class="hidden-input"
					type="file"
					accept="image/*"
					onchange={(event) => updateUploadedImage(event, 'before')}
				/>

				<div class="image-wrap">
					{#if beforeSrc}
						<img src={beforeSrc} alt={beforeName || 'Uploaded before image'} />
					{:else}
						<div class="empty-state">
							<p>Upload your original photo</p>
							<span>No demo image shown</span>
						</div>
					{/if}
				</div>

				{#if beforeName}
					<div class="file-meta">
						<span>{beforeName}</span>
						<button type="button" onclick={() => clearUploadedImage('before')}>Remove</button>
					</div>
				{/if}
			</article>

			<article class="compare-card">
				<div class="card-head">
					<p class="card-label">After</p>
					<button type="button" class="soft-button" onclick={() => afterInput?.click()}>
						Upload after
					</button>
				</div>
				<input
					bind:this={afterInput}
					class="hidden-input"
					type="file"
					accept="image/*"
					onchange={(event) => updateUploadedImage(event, 'after')}
				/>

				<div class="image-wrap">
					{#if afterSrc}
						<img src={afterSrc} alt={afterName || 'Uploaded after image'} />
					{:else}
						<div class="empty-state">
							<p>Upload your finished holographic shot</p>
							<span>No demo image shown</span>
						</div>
					{/if}
				</div>

				{#if afterName}
					<div class="file-meta">
						<span>{afterName}</span>
						<button type="button" onclick={() => clearUploadedImage('after')}>Remove</button>
					</div>
				{/if}
			</article>
		</div>
	</div>
</section>

<style>
	.compare-layout {
		display: grid;
		gap: 1.3rem;
	}

	.copy {
		display: grid;
		gap: 0.9rem;
		max-width: 42rem;
		margin: 0 auto;
		text-align: center;
	}

	h2,
	p {
		margin: 0;
	}

	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: #f8f8f4;
	}

	.copy p:last-child {
		color: rgba(234, 234, 230, 0.68);
		line-height: 1.7;
	}

	.compare-grid {
		display: grid;
		gap: 1rem;
	}

	.compare-card {
		display: grid;
		gap: 0.9rem;
		padding: 1rem;
		border-radius: 1.7rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015)),
			linear-gradient(160deg, rgba(16, 16, 18, 0.94), rgba(9, 9, 11, 0.94));
		box-shadow: 0 24px 56px rgba(0, 0, 0, 0.28);
	}

	.card-head,
	.file-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
	}

	.card-label {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(236, 236, 232, 0.58);
	}

	.soft-button,
	.file-meta button {
		padding: 0.8rem 1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background:
			linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.08),
				rgba(226, 231, 255, 0.08),
				rgba(255, 255, 255, 0.04)
			),
			rgba(255, 255, 255, 0.03);
		color: #f5f5f2;
		font-weight: 600;
	}

	.hidden-input {
		display: none;
	}

	.image-wrap {
		position: relative;
		min-height: 20rem;
		padding: 0.75rem;
		border-radius: 1.35rem;
		overflow: hidden;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			rgba(255, 255, 255, 0.03);
	}

	.image-wrap img,
	.empty-state {
		display: flex;
		width: 100%;
		height: 100%;
		min-height: 18.5rem;
		border-radius: 1rem;
	}

	.image-wrap img {
		display: block;
		object-fit: cover;
	}

	.empty-state {
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		border: 1px dashed rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.03);
		text-align: center;
		padding: 1.5rem;
	}

	.empty-state p {
		color: #f6f6f2;
		font-weight: 600;
	}

	.empty-state span,
	.file-meta {
		color: rgba(230, 230, 226, 0.64);
		font-size: 0.92rem;
	}

	.file-meta span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (min-width: 900px) {
		.compare-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
