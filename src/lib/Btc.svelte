<script lang="ts">
  export let value = 0;
  export let options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 8
  };

  const { format } = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'BTC',
		currencyDisplay: 'name',
    ...options
	});
</script>

<span class="whitespace-nowrap">{format(value)}</span>