<script lang="ts" context="module">
  const { format } = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
</script>
<script lang="ts">
  export let value = 0;
</script>

<span>{format(value)}</span>