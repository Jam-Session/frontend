<script lang="ts">
  import { Howl } from 'howler';

  export let src = '';

  if (src) {
    new Howl({ src, autoplay: true });
  }
</script>