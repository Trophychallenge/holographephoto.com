import { put } from '@vercel/blob';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE_BYTES = 4_500_000;

function sanitizeFilename(name: string) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '-');
}

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file');
	const slot = String(formData.get('slot') ?? 'asset');

	if (!(file instanceof File)) {
		return json({ error: 'Missing file upload.' }, { status: 400 });
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		return json({ error: 'File must be smaller than 4.5MB.' }, { status: 400 });
	}

	const filename = sanitizeFilename(file.name || `${slot}.png`);
	const pathname = `orders/${slot}/${Date.now()}-${filename}`;

	const blob = await put(pathname, file, {
		access: 'public',
		addRandomSuffix: true,
		contentType: file.type || undefined
	});

	return json({
		url: blob.url,
		pathname: blob.pathname,
		uploadedAt: new Date().toISOString()
	});
};
