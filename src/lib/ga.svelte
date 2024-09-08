<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-MB7JWEJ8K7', {
        page_title: document.title,
        page_path: window.location.pathname,
      });
    }
  });
</script>

<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-MB7JWEJ8K7">
  </script>
  <script>
    window.dataLayer = window.dataLayer || []

    function gtag() {
      dataLayer.push(arguments)
    }

    gtag('js', new Date())
    gtag('config', 'G-MB7JWEJ8K7', {
      page_title: document.title,
      page_path: window.location.pathname,
    })
  </script>
</svelte:head>