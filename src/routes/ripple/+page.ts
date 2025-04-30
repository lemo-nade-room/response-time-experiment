import type { PageLoad } from './$types';
import type { CellData } from '$lib/Table.svelte';

export const load: PageLoad = () => {
	const cellData: readonly CellData[] = new Array(49)
		.fill(null)
		.map((_, i) => ({ id: i, count: 1 }));
	return {
		cellData
	};
};
