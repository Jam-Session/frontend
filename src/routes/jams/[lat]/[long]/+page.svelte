<script lang="ts">
	import type { PageData } from "./$types";

  export let data: PageData;
  const { jams } = data;
</script>

<div class="container p-4">
  <ol class="space-y-4">
  {#each jams as jam}
    <li class="variant-soft-surface p-2 rounded">
      <article>
        <h2 class="text-4xl">{jam.artist_name}</h2>
        <strong>{jam.venue_name}</strong>
        <address>{jam.venue_address}</address>
        <time datetime={jam.datetime}>{new Date(jam.datetime).toLocaleString()}</time>
      </article>
    </li>    
  {/each}
</ol>

</div>
