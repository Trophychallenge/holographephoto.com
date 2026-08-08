<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { track } from '@vercel/analytics/sveltekit';
	import { rivalQuestProduct } from '$lib/products/rival-quest';
	import {
		getRivalQuestSummary,
		parseRivalQuestConfiguration,
		rivalQuestAgeRanges,
		rivalQuestPartyLengths,
		rivalQuestPlayerCounts,
		rivalQuestPrintableSections,
		rivalQuestSettings,
		rivalQuestTeams,
		type RivalQuestAgeRangeId,
		type RivalQuestPlayerCountId,
		type RivalQuestSettingId,
		type RivalQuestTeamId,
		type RivalQuestPartyLengthId
	} from '$lib/products/rival-quest-builder';

	const steps = [
		'Where is your quest happening?',
		'Choose Team One',
		'Choose Team Two',
		'Make it yours',
		'Your Rival Quest is ready'
	] as const;

	const settingOptions = Object.values(rivalQuestSettings);
	const teamOptions = Object.values(rivalQuestTeams);
	const ageOptions = Object.entries(rivalQuestAgeRanges) as [RivalQuestAgeRangeId, string][];
	const playerOptions = Object.entries(rivalQuestPlayerCounts) as [
		RivalQuestPlayerCountId,
		string
	][];
	const lengthOptions = Object.entries(rivalQuestPartyLengths) as [
		RivalQuestPartyLengthId,
		string
	][];

	let step = $state(0);
	let setting = $state<RivalQuestSettingId | ''>('');
	let teamOne = $state<RivalQuestTeamId | ''>('');
	let teamTwo = $state<RivalQuestTeamId | ''>('');
	let partyName = $state('');
	let ageRange = $state<RivalQuestAgeRangeId | ''>('');
	let playerCount = $state<RivalQuestPlayerCountId | ''>('');
	let partyLength = $state<RivalQuestPartyLengthId | ''>('');

	const cancelled = $derived(page.url.searchParams.get('checkout') === 'cancelled');
	const safePartyName = $derived(partyName.replace(/[<>]/g, '').replace(/\s+/g, ' ').slice(0, 60));
	const configResult = $derived(
		parseRivalQuestConfiguration({
			setting,
			team_one: teamOne,
			team_two: teamTwo,
			party_name: safePartyName,
			age_range: ageRange,
			player_count: playerCount,
			party_length: partyLength
		})
	);
	const config = $derived(configResult.ok ? configResult.config : null);
	const summary = $derived(config ? getRivalQuestSummary(config) : '');
	const selectedSetting = $derived(config ? rivalQuestSettings[config.setting] : null);
	const selectedTeamOne = $derived(config ? rivalQuestTeams[config.teamOne] : null);
	const selectedTeamTwo = $derived(config ? rivalQuestTeams[config.teamTwo] : null);
	const canContinue = $derived(
		(step === 0 && setting) ||
			(step === 1 && teamOne) ||
			(step === 2 && teamTwo && teamTwo !== teamOne) ||
			(step === 3 && ageRange && playerCount && partyLength) ||
			step === 4
	);

	function chooseSetting(value: RivalQuestSettingId) {
		setting = value;
	}

	function chooseTeamOne(value: RivalQuestTeamId) {
		teamOne = value;
		if (teamTwo === value) teamTwo = '';
	}

	function chooseTeamTwo(value: RivalQuestTeamId) {
		if (value !== teamOne) teamTwo = value;
	}

	function next() {
		if (canContinue && step < steps.length - 1) step += 1;
	}

	function back() {
		if (step > 0) step -= 1;
	}

	function goTo(index: number) {
		step = Math.max(0, Math.min(index, steps.length - 1));
	}

	onMount(() => {
		track('Rival Quest Page Visit', {
			product: rivalQuestProduct.metadataProduct,
			source: page.url.searchParams.get('utm_source') ?? 'direct'
		});
	});
</script>

<svelte:head>
	<title>Rival Quest Party Builder | Holograph</title>
	<meta
		name="description"
		content="Build a printable Rival Quest party game with your setting, friendly rival teams, age range, player count, and party length."
	/>
</svelte:head>

<section class="builder-page">
	<section class="builder-hero">
		<div class="hero-copy">
			<p class="eyebrow">Instant Digital Download</p>
			<h1>Build your Rival Quest party.</h1>
			<p class="hero-lede">
				Pick a party setting, choose two friendly rival teams, and create a printable quest kit
				matched to your celebration.
			</p>
			<div class="hero-facts" aria-label="Product facts">
				<span>{rivalQuestProduct.priceLabel}</span>
				<span>No shipping</span>
				<span>Friendly rivals</span>
			</div>
			{#if cancelled}
				<p class="checkout-note">Checkout was canceled. Your quest can be restarted below.</p>
			{/if}
		</div>
		<div class="hero-preview" aria-label="Rival Quest product previews">
			<img
				src={rivalQuestProduct.images[0].src}
				alt={rivalQuestProduct.images[0].alt}
				width="2000"
				height="2000"
			/>
			<img
				src={rivalQuestProduct.images[3].src}
				alt={rivalQuestProduct.images[3].alt}
				width="2000"
				height="2000"
			/>
		</div>
	</section>

	<section class="builder-card" aria-labelledby="builder-heading">
		<div class="progress-row">
			<p class="eyebrow">Step {step + 1} of {steps.length}</p>
			<div class="progress-track" aria-hidden="true">
				<span style={`width: ${((step + 1) / steps.length) * 100}%`}></span>
			</div>
		</div>

		<h2 id="builder-heading">{steps[step]}</h2>

		{#if step === 0}
			<div class="option-grid three">
				{#each settingOptions as option (option.id)}
					<button
						type="button"
						class:selected={setting === option.id}
						class="option-card setting-card"
						onclick={() => chooseSetting(option.id)}
					>
						<span class="option-art" style={`--accent: ${option.color}`}>{option.icon}</span>
						<strong>{option.label}</strong>
						<small>{option.description}</small>
					</button>
				{/each}
			</div>
		{:else if step === 1}
			<div class="option-grid">
				{#each teamOptions as option (option.id)}
					<button
						type="button"
						class:selected={teamOne === option.id}
						class="option-card team-card"
						onclick={() => chooseTeamOne(option.id)}
					>
						<span class="team-art" style={`--accent: ${option.color}`}>{option.icon}</span>
						<strong>{option.teamName}</strong>
						<small>{option.description}</small>
					</button>
				{/each}
			</div>
		{:else if step === 2}
			<div class="option-grid">
				{#each teamOptions as option (option.id)}
					<button
						type="button"
						class:selected={teamTwo === option.id}
						class="option-card team-card"
						disabled={teamOne === option.id}
						onclick={() => chooseTeamTwo(option.id)}
					>
						<span class="team-art" style={`--accent: ${option.color}`}>{option.icon}</span>
						<strong>{option.teamName}</strong>
						<small>
							{teamOne === option.id ? 'Already chosen for Team One' : option.description}
						</small>
					</button>
				{/each}
			</div>
		{:else if step === 3}
			<div class="customize-grid">
				<label class="field-card">
					<span>Birthday child or party name</span>
					<input
						bind:value={partyName}
						name="party_name_preview"
						maxlength="60"
						placeholder="Optional"
						autocomplete="off"
					/>
				</label>

				<div class="field-card">
					<span>Age range</span>
					<div class="pill-row">
						{#each ageOptions as [id, label] (id)}
							<button
								type="button"
								class:selected={ageRange === id}
								onclick={() => (ageRange = id)}
							>
								{label}
							</button>
						{/each}
					</div>
				</div>

				<div class="field-card">
					<span>Number of players</span>
					<div class="pill-row">
						{#each playerOptions as [id, label] (id)}
							<button
								type="button"
								class:selected={playerCount === id}
								onclick={() => (playerCount = id)}
							>
								{label}
							</button>
						{/each}
					</div>
				</div>

				<div class="field-card">
					<span>Party length</span>
					<div class="pill-row stacked">
						{#each lengthOptions as [id, label] (id)}
							<button
								type="button"
								class:selected={partyLength === id}
								onclick={() => (partyLength = id)}
							>
								{label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{:else if config && selectedSetting && selectedTeamOne && selectedTeamTwo}
			<div class="ready-layout">
				<div class="summary-panel">
					<p class="eyebrow">Your Rival Quest is ready</p>
					<h3>{summary}</h3>
					{#if config.partyName}
						<p class="party-name">{config.partyName}</p>
					{/if}
					<div class="summary-tags">
						<span>{rivalQuestAgeRanges[config.ageRange]}</span>
						<span>{rivalQuestPlayerCounts[config.playerCount]} players</span>
						<span>{rivalQuestPartyLengths[config.partyLength]}</span>
					</div>
					<div class="edit-row" aria-label="Edit selections">
						<button type="button" onclick={() => goTo(0)}>Edit setting</button>
						<button type="button" onclick={() => goTo(1)}>Edit teams</button>
						<button type="button" onclick={() => goTo(3)}>Edit details</button>
					</div>
				</div>

				<div class="kit-panel">
					<p class="eyebrow">Included in this build</p>
					<ul>
						<li>{selectedSetting.label} parent table guide</li>
						<li>{selectedTeamOne.teamName} card set</li>
						<li>{selectedTeamTwo.teamName} card set</li>
						<li>{selectedSetting.label} matching challenges</li>
						<li>Team signs, treasure tokens, score sheet, and celebration honors</li>
					</ul>
				</div>
			</div>

			<div class="setting-guide">
				<div>
					<p class="eyebrow">Parent table guide</p>
					<p>{selectedSetting.parentGuide}</p>
				</div>
				<div>
					<p class="eyebrow">Safety</p>
					<p>{selectedSetting.safety}</p>
				</div>
			</div>

			<div class="challenge-strip">
				{#each selectedSetting.challenges as challenge (challenge)}
					<div>{challenge}</div>
				{/each}
			</div>

			<form method="POST" action="/checkout" class="buy-panel">
				<input type="hidden" name="product" value={rivalQuestProduct.id} />
				<input type="hidden" name="setting" value={config.setting} />
				<input type="hidden" name="team_one" value={config.teamOne} />
				<input type="hidden" name="team_two" value={config.teamTwo} />
				<input type="hidden" name="party_name" value={config.partyName} />
				<input type="hidden" name="age_range" value={config.ageRange} />
				<input type="hidden" name="player_count" value={config.playerCount} />
				<input type="hidden" name="party_length" value={config.partyLength} />
				<div>
					<p class="eyebrow">Digital download</p>
					<strong>{rivalQuestProduct.priceLabel}</strong>
					<p>
						Preview note: checkout records your builder choices. Dynamic custom PDF assembly is the
						next implementation step; this preview still delivers the existing private ZIP.
					</p>
				</div>
				<button class="button-primary buy-button" type="submit">
					Buy Digital Game - {rivalQuestProduct.priceLabel}
				</button>
			</form>
		{:else}
			<p class="checkout-note">Finish each step to unlock your printable kit summary.</p>
		{/if}

		<div class="nav-row">
			<button
				type="button"
				class="button-secondary nav-button"
				disabled={step === 0}
				onclick={back}
			>
				Back
			</button>
			{#if step < steps.length - 1}
				<button
					type="button"
					class="button-primary nav-button"
					disabled={!canContinue}
					onclick={next}
				>
					Continue
				</button>
			{/if}
		</div>
	</section>

	<section class="print-system">
		<div class="section-head">
			<p class="eyebrow">Printable kit system</p>
			<h2>Only the selected quest belongs in the final kit.</h2>
			<p>
				The builder stores stable IDs for the chosen setting, two teams, ages, player count, and
				length. It does not accept prices, file paths, Blob URLs, or arbitrary kit content from the
				browser.
			</p>
		</div>
		<div class="included-grid">
			{#each rivalQuestPrintableSections as section (section)}
				<div class="included-item">{section}</div>
			{/each}
		</div>
	</section>

	<section class="rules-band">
		<div>
			<p class="eyebrow">Core rules</p>
			<h2>Friendly rivals, real teamwork.</h2>
		</div>
		<ul>
			<li>Divide children into two friendly rival teams.</li>
			<li>
				Children earn treasure coins for teamwork, kindness, creativity, participation, and
				completing challenges.
			</li>
			<li>Adults may award coins and may skip or adapt any activity.</li>
			<li>No pushing, hitting, dangerous behavior, cruel teasing, or exclusion.</li>
			<li>
				The finale celebrates both teams. The real victory is teamwork, kindness, and good memories.
			</li>
		</ul>
	</section>

	<section class="preview-strip" aria-label="Product preview images">
		{#each rivalQuestProduct.images.slice(1) as image (image.src)}
			<img src={image.src} alt={image.alt} width="2000" height="2000" loading="lazy" />
		{/each}
	</section>

	<section class="coming-soon">
		<p class="eyebrow">Coming Soon</p>
		<h2>Premium holographic card sets</h2>
		<p>
			A physical card version is being explored for future Holograph releases. There is no active
			preorder or physical-card checkout today.
		</p>
	</section>
</section>

<style>
	h1,
	h2,
	h3,
	p {
		margin: 0;
	}

	h1,
	h2,
	h3 {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		color: #fff8ef;
		text-wrap: balance;
	}

	h1 {
		font-size: clamp(2.8rem, 7vw, 6rem);
		line-height: 0.92;
	}

	h2 {
		font-size: clamp(2rem, 5vw, 3.8rem);
		line-height: 0.98;
	}

	h3 {
		font-size: clamp(1.9rem, 4.8vw, 3.4rem);
		line-height: 1;
	}

	p,
	li,
	small {
		color: rgba(255, 248, 239, 0.8);
		line-height: 1.55;
	}

	button,
	input {
		font: inherit;
	}

	button {
		cursor: pointer;
	}

	.builder-page {
		width: var(--frame-rail);
		margin: 0 auto;
		padding: 1rem 0 2.5rem;
		display: grid;
		gap: 1rem;
	}

	.builder-hero {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(17rem, 0.8fr);
		gap: clamp(1rem, 4vw, 2.5rem);
		align-items: center;
		min-height: min(620px, calc(100vh - 7rem));
	}

	.hero-copy {
		display: grid;
		gap: 1rem;
	}

	.hero-lede {
		max-width: 42rem;
		font-size: clamp(1rem, 2vw, 1.22rem);
	}

	.hero-facts,
	.summary-tags,
	.edit-row,
	.nav-row,
	.pill-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.hero-facts span,
	.summary-tags span {
		padding: 0.52rem 0.75rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.09);
		color: #fff8ef;
		font-size: 0.85rem;
	}

	.hero-preview {
		display: grid;
		grid-template-columns: 1fr 0.75fr;
		gap: 0.75rem;
		align-items: center;
	}

	.hero-preview img,
	.preview-strip img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 1.4rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 26px 62px rgba(0, 0, 0, 0.32);
	}

	.hero-preview img:first-child {
		transform: rotate(-1.5deg);
	}

	.hero-preview img:last-child {
		transform: rotate(2deg);
	}

	.builder-card,
	.print-system,
	.rules-band,
	.coming-soon {
		padding: clamp(1rem, 3vw, 1.5rem);
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 1.5rem;
		background:
			radial-gradient(circle at top left, rgba(255, 207, 107, 0.22), transparent 28%),
			radial-gradient(circle at top right, rgba(112, 217, 255, 0.18), transparent 30%),
			linear-gradient(160deg, rgba(31, 28, 48, 0.94), rgba(16, 17, 27, 0.95));
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
	}

	.builder-card {
		display: grid;
		gap: 1rem;
	}

	.progress-row {
		display: grid;
		gap: 0.55rem;
	}

	.progress-track {
		height: 0.62rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		overflow: hidden;
	}

	.progress-track span {
		display: block;
		height: 100%;
		border-radius: inherit;
		background: linear-gradient(90deg, #ffcf6b, #ff9fe2, #70d9ff);
	}

	.option-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.option-grid.three {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.option-card,
	.field-card,
	.summary-panel,
	.kit-panel,
	.setting-guide,
	.challenge-strip div,
	.buy-panel,
	.included-item {
		border: 1px solid rgba(255, 255, 255, 0.13);
		border-radius: 1.15rem;
		background: rgba(255, 255, 255, 0.07);
	}

	.option-card {
		min-height: 12rem;
		padding: 1rem;
		display: grid;
		gap: 0.65rem;
		justify-items: start;
		text-align: left;
		color: #fff8ef;
		transition:
			transform 150ms ease,
			border-color 150ms ease,
			background 150ms ease;
	}

	.option-card:hover,
	.option-card:focus-visible,
	.option-card.selected {
		transform: translateY(-2px);
		border-color: rgba(255, 207, 107, 0.72);
		background: rgba(255, 255, 255, 0.12);
	}

	.option-card:disabled {
		cursor: not-allowed;
		opacity: 0.45;
		transform: none;
	}

	.option-card strong {
		font-size: 1.05rem;
	}

	.option-art,
	.team-art {
		width: 4.25rem;
		aspect-ratio: 1;
		display: grid;
		place-items: center;
		border-radius: 1.1rem;
		background:
			linear-gradient(145deg, color-mix(in srgb, var(--accent) 72%, white), var(--accent)), #ffcf6b;
		color: #201425;
		font-weight: 900;
		box-shadow: 0 14px 28px color-mix(in srgb, var(--accent) 32%, transparent);
	}

	.team-art {
		width: 4.6rem;
		border-radius: 999px;
	}

	.customize-grid,
	.ready-layout,
	.setting-guide {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.8rem;
	}

	.field-card,
	.summary-panel,
	.kit-panel,
	.buy-panel {
		padding: 1rem;
		display: grid;
		gap: 0.75rem;
	}

	.field-card > span {
		color: #fff8ef;
		font-weight: 800;
	}

	input {
		width: 100%;
		min-height: 3rem;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 0.85rem;
		padding: 0 0.85rem;
		background: rgba(255, 255, 255, 0.1);
		color: #fff8ef;
	}

	.pill-row button,
	.edit-row button {
		min-height: 2.75rem;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 999px;
		padding: 0.45rem 0.8rem;
		background: rgba(255, 255, 255, 0.07);
		color: #fff8ef;
	}

	.pill-row.stacked button {
		border-radius: 0.9rem;
	}

	.pill-row button.selected {
		border-color: #ffcf6b;
		background: rgba(255, 207, 107, 0.18);
	}

	.ready-layout {
		align-items: stretch;
	}

	.party-name {
		color: #ffcf6b;
		font-weight: 800;
	}

	.kit-panel ul,
	.rules-band ul {
		margin: 0;
		padding-left: 1.2rem;
		display: grid;
		gap: 0.45rem;
	}

	.setting-guide {
		padding: 1rem;
	}

	.setting-guide > div {
		display: grid;
		gap: 0.45rem;
	}

	.challenge-strip {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.challenge-strip div,
	.included-item {
		padding: 0.85rem;
		color: rgba(255, 248, 239, 0.86);
	}

	.buy-panel {
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		background: rgba(255, 207, 107, 0.12);
	}

	.buy-panel strong {
		color: #fff8ef;
		font-size: 2rem;
	}

	.buy-button,
	.nav-button {
		border: 0;
		min-height: 3rem;
		font-weight: 800;
	}

	.nav-row {
		justify-content: space-between;
	}

	.nav-button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.section-head {
		display: grid;
		gap: 0.55rem;
		margin-bottom: 1rem;
	}

	.included-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.rules-band {
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1fr);
		gap: 1rem;
	}

	.preview-strip {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.checkout-note {
		padding: 0.75rem 0.9rem;
		border: 1px solid rgba(255, 207, 107, 0.3);
		border-radius: 0.9rem;
		background: rgba(255, 207, 107, 0.1);
		color: #fff8ef;
	}

	@media (max-width: 960px) {
		.builder-hero,
		.rules-band,
		.ready-layout,
		.setting-guide {
			grid-template-columns: 1fr;
		}

		.option-grid,
		.option-grid.three,
		.challenge-strip,
		.included-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.preview-strip {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 640px) {
		.builder-page {
			width: min(100%, calc(100vw - 1rem));
			padding-top: 1rem;
		}

		.builder-hero {
			min-height: auto;
		}

		.hero-preview,
		.option-grid,
		.option-grid.three,
		.customize-grid,
		.challenge-strip,
		.included-grid,
		.preview-strip,
		.buy-panel {
			grid-template-columns: 1fr;
		}

		.option-card {
			min-height: 9.5rem;
		}

		.buy-panel,
		.buy-button,
		.nav-button {
			width: 100%;
		}
	}
</style>
