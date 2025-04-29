<script lang="ts">
	let { count } = $props<{
		count: number;
	}>();


	let effecting = $state(false);
	let lastEffectedAt = $state(new Date().getTime());

	$effect(() => {
		lastEffectedAt = new Date().getTime();
		effecting = true;
		console.log('❤️')
		setTimeout(() => {
			const current = new Date().getTime();
			if (lastEffectedAt + 500 < current) {
				effecting = false;
			}
		}, 500);
	});
</script>

<div class:effecting class="cell {`color-${count}`}">{ count }</div>

<style>
    .cell {
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
        font-size: 20px;
        font-weight: bold;

        &.color-1 {
            background-color: #ffadad;
        }

        &.color-2 {
            background-color: #ff9e4e;
        }

        &.color-3 {
            background-color: #ffd059;
        }

        &.color-4 {
            background-color: #beff88;
        }

        &.color-5 {
            background-color: #5efff2;
        }

        &.color-6 {
            background-color: #3e48ff;
        }

        &.color-7 {
            background-color: #c228ed;
        }

        &.effecting {
            animation: blink 100ms step-start infinite;
        }

        @keyframes blink {
            0%, 49% {
                opacity: 1;
            }
            50%, 100% {
                opacity: 0;
            }
        }
    }
</style>