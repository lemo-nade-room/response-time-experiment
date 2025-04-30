// useOpticState.svelte.ts
import { untrack } from 'svelte';
import type { CellData } from '$lib/Table.svelte';
import type { useMockServer } from '$lib/useMockServer.svelte';

/**
 * 楽観 UI 用のクライアントサイドストア
 *
 * 1. UI には即座に反映（＝楽観更新）
 * 2. サーバーが成功 → そのまま確定
 * 3. サーバーが失敗 → 元に戻す（ロールバック）
 */
export function useOpticState(
	initial: readonly CellData[],
	server: ReturnType<typeof useMockServer>
) {
	/* ------------------------------ state ------------------------------ */
	/** 画面表示用 ― 常に UI が読む唯一のソース */
	let cells = $state<readonly CellData[]>([...initial]);

	/** ロールバック用スナップショットを id ごとに保存 */
	const snapshot = new Map<number, CellData>();

	/* ---------------------------- helpers ----------------------------- */
	function replace(id: number, next: CellData) {
		// 不変データで差し替える
		const copy = [...cells];
		const idx = copy.findIndex((c) => c.id === id);
		if (idx === -1) return;
		copy[idx] = next;
		cells = copy;
	}

	/* -------------------------- public API ---------------------------- */
	/**
	 * セル値を+1 楽観更新付
	 */
	async function incrementCell(id: number): Promise<void> {
		/* --- ❶ 楽観更新 --- */
		const before = cells.find((c) => c.id === id);
		if (!before) throw new Error(`Cell ${id} not found`);

		// 保存しておく (ロールバック用途)
		snapshot.set(id, before);

		// untrack で依存登録を抑制し副作用ループを防止
		untrack(() =>
			replace(id, {
				...before,
				count: before.count < 7 ? before.count + 1 : 0
			})
		);

		/* --- ❷ サーバー反映 --- */
		try {
			await server.incrementCell(id);

			/* --- ❸ サーバー公式値で確定 --- */
			const official = await server.loadCell(id);
			replace(id, official);
			snapshot.delete(id);
		} catch (err) {
			/* --- ❹ 失敗時にロールバック --- */
			const prev = snapshot.get(id);
			if (prev) replace(id, prev);
			snapshot.delete(id);
			throw err; // 呼び出し側に通知
		}
	}

	/**
	 * 単一セルをリロード
	 * – 外部から強制リロードしたいときに利用
	 */
	async function loadCell(id: number): Promise<CellData> {
		const fresh = await server.loadCell(id);
		replace(id, fresh);
		return fresh;
	}

	/**
	 * getter: リアクティブに `cells` を公開
	 */
	return {
		incrementCell,
		loadCell,
		get cells() {
			return cells;
		}
	} as const;
}
