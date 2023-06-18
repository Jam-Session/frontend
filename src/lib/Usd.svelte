<script lang="ts">
  export let value = 0;
  export let options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 0
  };

  const { format } = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', ...options });
</script>

<span>{format(value)}</span>