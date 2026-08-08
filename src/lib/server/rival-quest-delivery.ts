import { get } from '@vercel/blob';
import { env } from '$env/dynamic/private';
import { rivalQuestProduct, isRivalQuestMetadata } from '$lib/products/rival-quest';
import { fetchCheckoutSession, type StripeCheckoutSession } from '$lib/server/stripe';

export type RivalQuestSessionVerification =
	| {
			ok: true;
			session: StripeCheckoutSession;
			customerEmail: string;
	  }
	| {
			ok: false;
			status: number;
			message: string;
	  };

function normalizeSessionId(value: string | null) {
	const sessionId = value?.trim() ?? '';
	if (!/^cs_(test|live)_[a-zA-Z0-9_]+$/.test(sessionId)) return '';
	return sessionId;
}

export function verifyRivalQuestCheckoutSessionRecord(
	session: StripeCheckoutSession
): RivalQuestSessionVerification {
	if (!isRivalQuestMetadata(session.metadata)) {
		return {
			ok: false,
			status: 403,
			message: 'This checkout session is not for Rival Quest.'
		};
	}

	if (session.payment_status !== 'paid') {
		return {
			ok: false,
			status: 402,
			message: 'This checkout session has not been paid yet.'
		};
	}

	if (
		session.amount_total !== rivalQuestProduct.priceCents ||
		session.currency !== rivalQuestProduct.currency
	) {
		return {
			ok: false,
			status: 403,
			message: 'This checkout session does not match the Rival Quest product configuration.'
		};
	}

	const customerEmail = session.customer_details?.email;
	if (!customerEmail) {
		return {
			ok: false,
			status: 403,
			message: 'This checkout session is missing a customer email.'
		};
	}

	return {
		ok: true,
		session,
		customerEmail
	};
}

export async function verifyRivalQuestCheckoutSession({
	fetch,
	sessionId
}: {
	fetch: typeof globalThis.fetch;
	sessionId: string | null;
}) {
	const normalizedSessionId = normalizeSessionId(sessionId);
	if (!normalizedSessionId) {
		return {
			ok: false,
			status: 400,
			message: 'Missing or invalid checkout session.'
		} satisfies RivalQuestSessionVerification;
	}

	const session = await fetchCheckoutSession(fetch, normalizedSessionId);
	return verifyRivalQuestCheckoutSessionRecord(session);
}

export async function getRivalQuestDownload() {
	const pathname = env.RIVAL_QUEST_BLOB_PATHNAME || rivalQuestProduct.blobPathname;
	const token = env.RIVAL_QUEST_BLOB_READ_WRITE_TOKEN;

	const result = await get(pathname, {
		access: 'private',
		useCache: false,
		...(token ? { token } : {}),
		...(!token && env.RIVAL_QUEST_BLOB_STORE_ID
			? { storeId: env.RIVAL_QUEST_BLOB_STORE_ID }
			: {})
	});

	if (!result?.stream) {
		throw new Error('Rival Quest download source is unavailable.');
	}

	return result;
}
