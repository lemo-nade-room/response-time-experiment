import type { CellData } from '$lib/Table.svelte';

export async function loadAllCell(): Promise<readonly CellData[]> {
	return new Array(49).fill(null).map((_, i) => ({ id: i, count: 1 }));
}