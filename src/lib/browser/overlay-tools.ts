function loadImage(src: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error('Unable to load image for cleanup.'));
		image.src = src;
	});
}

export async function removeLightBackgroundFromFile(file: File) {
	const objectUrl = URL.createObjectURL(file);

	try {
		const image = await loadImage(objectUrl);
		const canvas = document.createElement('canvas');
		canvas.width = image.naturalWidth || image.width;
		canvas.height = image.naturalHeight || image.height;

		const context = canvas.getContext('2d');
		if (!context) throw new Error('Canvas is not available for image cleanup.');

		context.drawImage(image, 0, 0);
		const frame = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = frame.data;

		for (let index = 0; index < pixels.length; index += 4) {
			const red = pixels[index];
			const green = pixels[index + 1];
			const blue = pixels[index + 2];

			const luminance = red * 0.299 + green * 0.587 + blue * 0.114;
			const distanceFromWhite = 255 - luminance;

			if (luminance > 242) {
				pixels[index + 3] = 0;
				continue;
			}

			if (luminance > 214) {
				const normalizedAlpha = Math.max(0, Math.min(1, distanceFromWhite / 34));
				pixels[index + 3] = Math.round(normalizedAlpha * 255);
			}

			if (distanceFromWhite > 18) {
				const emphasis = Math.min(1.22, 1 + distanceFromWhite / 255);
				pixels[index] = Math.max(0, Math.min(255, Math.round(red * emphasis * 0.96)));
				pixels[index + 1] = Math.max(0, Math.min(255, Math.round(green * emphasis * 0.96)));
				pixels[index + 2] = Math.max(0, Math.min(255, Math.round(blue * emphasis * 0.96)));
			}
		}

		context.putImageData(frame, 0, 0);

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/png', 1)
		);

		if (!blob) {
			throw new Error('Unable to export cleaned overlay.');
		}

		const cleanedName = file.name.replace(/\.[^.]+$/, '') || 'overlay';
		return new File([blob], `${cleanedName}-cleaned.png`, { type: 'image/png' });
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}
