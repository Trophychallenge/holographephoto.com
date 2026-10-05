import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInventoryDashboard, setCapacity, setVariantInventory } from '$lib/server/inventory';

export const prerender = false;

export const load: PageServerLoad = async () => {
	try {
		return { dashboard: await getInventoryDashboard(), loadError: '' };
	} catch (error) {
		return {
			dashboard: { capacity: null, variants: [] },
			loadError:
				error instanceof Error
					? error.message
					: 'Inventory is unavailable. Check the Neon database configuration.'
		};
	}
};

function parseInteger(value: FormDataEntryValue | null) {
	const parsed = Number(value);
	return Number.isSafeInteger(parsed) ? parsed : null;
}

export const actions: Actions = {
	capacity: async ({ request }) => {
		const formData = await request.formData();
		const totalUnits = parseInteger(formData.get('total_units'));
		const enabled = formData.get('enabled') === 'true';
		if (totalUnits === null || totalUnits < 0)
			return fail(400, { error: 'Enter a valid capacity.' });
		try {
			await setCapacity({ totalUnits, enabled, actor: 'admin-basic-auth' });
			return { success: 'Halloween Edition capacity updated.' };
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Unable to update capacity.'
			});
		}
	},
	variant: async ({ request }) => {
		const formData = await request.formData();
		const sku = String(formData.get('sku') ?? '');
		const inventoryQuantity = parseInteger(formData.get('inventory_quantity'));
		const enabled = formData.get('enabled') === 'true';
		if (!sku || inventoryQuantity === null || inventoryQuantity < 0) {
			return fail(400, { error: 'Enter a valid SKU quantity.' });
		}
		try {
			await setVariantInventory({ sku, inventoryQuantity, enabled, actor: 'admin-basic-auth' });
			return { success: 'SKU inventory updated.' };
		} catch (error) {
			return fail(400, { error: error instanceof Error ? error.message : 'Unable to update SKU.' });
		}
	}
};
