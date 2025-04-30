<script lang="ts">
	import Table from '$lib/Table.svelte';
	import type { PageProps } from './$types';
	import { useMockServer } from '$lib/useMockServer.svelte';

	let { data }: PageProps = $props();

	let 全状態 = $state(data.cellData);
	const server = useMockServer(data.cellData);

	let useEffect = $state(true)
	function toggleUseEffect() {
		useEffect = !useEffect;
	}

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

<label><input checked={useEffect} onchange={toggleUseEffect} type="radio" name="useEffect" value="true" /> 再レンダリング表示</label>
<label><input checked={!useEffect} onchange={toggleUseEffect} type="radio" name="useEffect" value="false" /> 再レンダリング非表示</label>

<Table cells={全状態} onclickCell={handleClick} {useEffect}></Table>

<a href="/">全ロード</a>
<a href="/optic">楽観的UI</a>
<a href="/ripple">アニメーション付き</a>