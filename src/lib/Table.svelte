<script module lang="ts">
	export interface CellData {
		readonly id: number;
		readonly count: number;
	}
</script>

<script lang="ts">
	import Cell from '$lib/Cell.svelte';

	let { cells, onclickCell } = $props<{
		cells: readonly CellData[]
		onclickCell: (id: number) => unknown
	}>();
</script>

<div class="table">
	{#each cells as cell(cell.id)}
		<button onclick={() => onclickCell(cell.id)}>
			<Cell count={cell.count} />
		</button>
	{/each}
</div>

<style>
	.table {
			display: grid;
			width: 342px;
			height: 342px;
			grid-template-columns: repeat(7, 1fr);
			grid-template-rows: repeat(7, 1fr);
			gap: 1px;

			& > button {
					border: 1px solid #000;
					background: none;
					padding: 0;
					margin: 0;
			}
	}
</style>