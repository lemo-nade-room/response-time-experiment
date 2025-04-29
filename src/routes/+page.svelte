<script lang="ts">
	import Table from '$lib/Table.svelte';
	import type { PageProps } from './$types';
	import { useMockServer } from '$lib/useMockServer.svelte';

	let { data }: PageProps = $props();

	let 全状態 = $state(data.cellData);
	const server = useMockServer(data.cellData);

	async function handleClick(id: number) {
		console.log('💚 クリックされた', id);
		await server.incrementCell(id);
		console.log('💚 サーバーコマンド', id);
		全状態 = await server.loadAllCell();
		console.log('💚 全読み込み', id);
	}
</script>

<p>レスポンスタイム: {server.timeout}</p>
<button onclick={() => server.updateTimeout(server.timeout + 100)}>+100ms</button>
<button onclick={() => server.updateTimeout(server.timeout - 100)}>-100ms</button>

<Table cells={全状態} onclickCell={handleClick}></Table>
