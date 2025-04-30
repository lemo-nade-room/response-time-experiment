<script lang="ts">
	import Table from '$lib/Table.svelte';
	import type { PageProps } from './$types';
	import { useMockServer } from '$lib/useMockServer.svelte';
	import { useOpticState } from '$lib/useOpticState.svelte';

	let { data }: PageProps = $props();

	const server = useMockServer(data.cellData);
	const optimistic = useOpticState(data.cellData, server);

	async function handleClick(id: number) {
		console.log('💚 クリックされた', id);
		await optimistic.incrementCell(id)
		console.log('💚 サーバーコマンド', id);
		await optimistic.loadCell(id)
		console.log('💚 単セル読み込み', id);
	}
</script>

<p>レスポンスタイム: {server.timeout}</p>
<button onclick={() => server.updateTimeout(server.timeout + 100)}>+100ms</button>
<button onclick={() => server.updateTimeout(server.timeout - 100)}>-100ms</button>

<Table cells={optimistic.cells} onclickCell={handleClick}></Table>
