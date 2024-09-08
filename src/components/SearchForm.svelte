<script lang="ts">
  export let searchQuery: string;
  export let tags: string[];
  export let addTag: (event: KeyboardEvent) => void;
  export let removeTag: (index: number) => void;

  let isComposing = false;

  function handleKeyDown(event: KeyboardEvent) {
    if (!isComposing && event.key === 'Enter') {
      addTag(event);
    }
  }

  function handleCompositionStart() {
    isComposing = true;
  }

  function handleCompositionEnd() {
    isComposing = false;
  }
</script>

<div class="mb-6">
  <input
    type="text"
    class="border border-gray-300 rounded-lg p-2 w-full"
    placeholder="Search and press Enter"
    bind:value={searchQuery}
    on:keydown={handleKeyDown}
    on:compositionstart={handleCompositionStart}
    on:compositionend={handleCompositionEnd}
  />
  <div class="mt-4 flex flex-wrap">
    {#each tags as tag, index}
      <div class="flex items-center bg-blue-100 text-blue-600 px-4 py-2 rounded-full mr-2 mb-2">
        <span>{tag}</span>
        <button class="ml-2 text-blue-600 hover:text-blue-800" on:click={() => removeTag(index)}>
          &times;
        </button>
      </div>
    {/each}
  </div>
</div>
