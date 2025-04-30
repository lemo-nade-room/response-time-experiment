import type { CellData } from '$lib/Table.svelte';

export function useMockServer(cellData: readonly CellData[]) {
	let timeout = $state(1000);

	let idToCell = $state<ReadonlyMap<number, CellData>>(
		new Map(cellData.map((cell) => [cell.id, cell]))
	);

	async function incrementCell(id: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, timeout));

		const cell = idToCell.get(id);
		if (cell === undefined) throw new Error(`Server: Cell ${id} not found`);
		const updated = new Map(idToCell);
		updated.set(id, { ...cell, count: cell.count < 7 ? cell.count + 1 : 0 });
		idToCell = updated;
	}

	async function loadAllCell(): Promise<readonly CellData[]> {
		await new Promise((resolve) => setTimeout(resolve, timeout));

		return JSON.parse(JSON.stringify([...idToCell.values()].sort((a, b) => a.id - b.id)));
	}

	async function loadCell(id: number): Promise<CellData> {
		await new Promise((resolve) => setTimeout(resolve, timeout));

		return JSON.parse(JSON.stringify(idToCell.get(id)));
	}

	function updateTimeout(newTimeout: number) {
		timeout = newTimeout;
	}

	return {
		incrementCell,
		loadAllCell,
		loadCell,
		updateTimeout,
		get timeout() {
			return timeout;
		}
	};
}
