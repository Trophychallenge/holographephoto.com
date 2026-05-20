import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { Handle } from '@sveltejs/kit';
import { timingSafeEqual } from 'node:crypto';

function secureEqual(left: string, right: string) {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);

	if (leftBuffer.length !== rightBuffer.length) {
		return false;
	}

	return timingSafeEqual(leftBuffer, rightBuffer);
}

function unauthorizedResponse(message: string, status = 401) {
	return new Response(message, {
		status,
		headers: {
			'WWW-Authenticate': 'Basic realm="Holographe Orders"'
		}
	});
}

function isAuthorized(header: string | null, expectedUsername: string, expectedPassword: string) {
	if (!header?.startsWith('Basic ')) {
		return false;
	}

	try {
		const credentials = Buffer.from(header.slice(6), 'base64').toString('utf8');
		const separatorIndex = credentials.indexOf(':');

		if (separatorIndex === -1) {
			return false;
		}

		const username = credentials.slice(0, separatorIndex);
		const password = credentials.slice(separatorIndex + 1);

		return secureEqual(username, expectedUsername) && secureEqual(password, expectedPassword);
	} catch {
		return false;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.url.pathname.startsWith('/admin/orders')) {
		return resolve(event);
	}

	const expectedUsername = env.ADMIN_ORDERS_USERNAME ?? '';
	const expectedPassword = env.ADMIN_ORDERS_PASSWORD ?? '';

	if (!expectedUsername || !expectedPassword) {
		if (dev) {
			return resolve(event);
		}

		return unauthorizedResponse('Admin order access is not configured.', 503);
	}

	if (!isAuthorized(event.request.headers.get('authorization'), expectedUsername, expectedPassword)) {
		return unauthorizedResponse('Authentication required.');
	}

	return resolve(event);
};
