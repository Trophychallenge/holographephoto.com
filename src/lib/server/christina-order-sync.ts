import { createHmac } from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import { getPaidOrder } from '$lib/server/orders';
import { env } from '$env/dynamic/private';
import type { StoredPaidOrderRecord } from '$lib/server/orders';

const PREFIX = 'paid-orders/christina-sync/';
const RETRY_DELAY_MS = 5 * 60 * 1000;

export type ChristinaSyncStatus = 'pending' | 'synced' | 'failed';
export type ChristinaOrderSyncJob = {
	sessionId: string;
	status: ChristinaSyncStatus;
	attempts: number;
	createdAt: string;
	updatedAt: string;
	nextAttemptAt: string | null;
	syncedAt: string | null;
	lastError: string | null;
};

function options() {
	if (!env.ORDER_BLOB_STORE_ID) throw new Error('Missing ORDER_BLOB_STORE_ID for private paid-order storage.');
	return { storeId: env.ORDER_BLOB_STORE_ID };
}
function pathname(sessionId: string) { return `${PREFIX}${sessionId}.json`; }
function sourceEnvironment() {
	if (env.VERCEL_ENV === 'production') return 'production';
	if (env.VERCEL_ENV === 'preview') return 'preview';
	return 'development';
}
function product(record: StoredPaidOrderRecord) {
	return record.metadata.offer || record.lineItems[0]?.description || 'Holographe order';
}
function quantity(record: StoredPaidOrderRecord) {
	const parsed = Number(record.metadata.quantity || record.lineItems[0]?.quantity || 1);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function buildChristinaOrderPayload(record: StoredPaidOrderRecord) {
	return {
		schemaVersion: 1 as const,
		checkoutSessionId: record.sessionId,
		stripeEventId: record.eventId,
		sourceEnvironment: sourceEnvironment(),
		purchaseAt: new Date((record.created ?? 0) * 1000 || Date.parse(record.storedAt)).toISOString(),
		recoveryImportedAt: record.eventType === 'admin.paid_order_backfill' ? record.storedAt : null,
		paymentStatus: record.paymentStatus || 'paid',
		fulfillmentStatus: 'NEW' as const,
		amountTotal: record.amountTotal || 0,
		currency: (record.currency || 'usd').toLowerCase(),
		product: product(record),
		quantity: quantity(record),
		customer: record.customerDetails ? { name: record.customerDetails.name ?? null, email: record.customerDetails.email ?? null, phone: record.customerDetails.phone ?? null, address: record.customerDetails.address ?? undefined } : undefined,
		shipping: record.shippingDetails ? { name: record.shippingDetails.name ?? null, address: record.shippingDetails.address ?? undefined } : undefined,
		productionReferences: { baseBlobPathname: record.metadata.base_blob_pathname || null, overlayBlobPathname: record.metadata.overlay_blob_pathname || null }
	};
}

export async function getChristinaSyncJob(sessionId: string): Promise<ChristinaOrderSyncJob | null> {
	const blob = await get(pathname(sessionId), { ...options(), access: 'private', useCache: false });
	return blob?.stream ? (await new Response(blob.stream).json()) as ChristinaOrderSyncJob : null;
}
async function save(job: ChristinaOrderSyncJob) {
	await put(pathname(job.sessionId), JSON.stringify(job, null, 2), { ...options(), access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
}

export async function syncPaidOrderToChristina(record: StoredPaidOrderRecord) {
	let job = await getChristinaSyncJob(record.sessionId);
	if (job?.status === 'synced') return job;
	const now = new Date();
	if (job?.nextAttemptAt && new Date(job.nextAttemptAt) > now) return job;
	job = job ?? { sessionId: record.sessionId, status: 'pending', attempts: 0, createdAt: now.toISOString(), updatedAt: now.toISOString(), nextAttemptAt: null, syncedAt: null, lastError: null };
	await save(job);
	if (!env.CHRISTINA_OS_ORDER_SYNC_URL || !env.CHRISTINA_OS_ORDER_SYNC_SECRET) {
		const failed = { ...job, status: 'failed' as const, updatedAt: now.toISOString(), nextAttemptAt: new Date(now.getTime() + RETRY_DELAY_MS).toISOString(), lastError: 'ChristinaOS sync is not configured.' };
		await save(failed); return failed;
	}
	const payload = JSON.stringify(buildChristinaOrderPayload(record));
	const timestamp = String(Date.now());
	try {
		const response = await fetch(env.CHRISTINA_OS_ORDER_SYNC_URL, { method: 'POST', headers: { 'content-type': 'application/json', 'x-holographe-timestamp': timestamp, 'x-holographe-signature': createHmac('sha256', env.CHRISTINA_OS_ORDER_SYNC_SECRET).update(`${timestamp}.${payload}`).digest('hex') }, body: payload });
		if (!response.ok) throw new Error(`ChristinaOS responded ${response.status}.`);
		const synced = { ...job, status: 'synced' as const, attempts: job.attempts + 1, updatedAt: now.toISOString(), syncedAt: now.toISOString(), nextAttemptAt: null, lastError: null };
		await save(synced); return synced;
	} catch (error) {
		const failed = { ...job, status: 'failed' as const, attempts: job.attempts + 1, updatedAt: now.toISOString(), nextAttemptAt: new Date(now.getTime() + RETRY_DELAY_MS).toISOString(), lastError: error instanceof Error ? error.message : 'Unknown ChristinaOS sync failure.' };
		await save(failed); return failed;
	}
}

export async function retryDueChristinaOrderSyncs(limit = 25) {
	const { blobs } = await list({ ...options(), prefix: PREFIX, limit: Math.max(limit, 100) });
	let attempted = 0;
	let synced = 0;
	for (const blob of blobs.slice(0, limit)) {
		const sessionId = blob.pathname.slice(PREFIX.length, -'.json'.length);
		const job = await getChristinaSyncJob(sessionId);
		if (!job || job.status === 'synced' || (job.nextAttemptAt && new Date(job.nextAttemptAt) > new Date())) continue;
		const record = await getPaidOrder(sessionId);
		if (!record) continue;
		attempted += 1;
		const result = await syncPaidOrderToChristina(record);
		if (result.status === 'synced') synced += 1;
	}
	return { attempted, synced };
}
