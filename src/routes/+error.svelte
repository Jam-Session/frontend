<script>
  import { page } from '$app/stores';
</script>

<div class="container p-4">
  <h1>{$page.status}: {$page.error?.message || 'Something went wrong'}</h1>
</div>