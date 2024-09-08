<script lang="ts">
  import { onMount } from 'svelte';
  import 'prismjs/themes/prism.css';

  // Font Awesomeアイコンのインポート
  import { faStar, faComment, faCodeBranch, faCalendar, faFile, faArrowUp } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let gists: Array<{
    owner: { login: string };
    description: string;
    files: Array<{ name: string; text: string; language: { name: string } | null }>;
    stargazerCount: number;
    createdAt: string;
    comments: { totalCount: number };
    forks: { totalCount: number };
    url: string;
    title: string;
    codePreview: string;
    language: string;
    fileCount: number;
    id: string; // GistのIDを追加
  }> = [];

  let filteredGists = gists;
  let searchQuery = "";
  let tags: string[] = [];
  let showScrollButton = false; // 最上部に戻るボタンの表示管理

  // Prism.jsを動的にインポートして、クライアントサイドで使用
  async function applySyntaxHighlighting() {
    const Prism = await import('prismjs');
    // @ts-ignore
    await import('prismjs/components/prism-javascript');
    // @ts-ignore
    await import('prismjs/components/prism-python');
    // @ts-ignore
    await import('prismjs/components/prism-java');
    // @ts-ignore
    await import('prismjs/components/prism-ruby');
    // @ts-ignore
    await import('prismjs/components/prism-json');
    Prism.highlightAll();
  }

  // JSONファイルからGistsを取得
  async function fetchGists() {
    const response = await fetch('gists.json');
    const json = await response.json();
    gists = json.map((gist: any, index: number) => {
      const title = gist.files.length > 0 ? `${gist.owner.login}/${gist.files[0].name}` : 'No Title';
      const codePreview = gist.files.length > 0 ? gist.files[0].text : 'No Code Available';
      const language = gist.files.length > 0 && gist.files[0].language ? gist.files[0].language.name.toLowerCase() : 'plaintext';
      const fileCount = gist.files.length;
      return { ...gist, title, codePreview, language, fileCount, id: `gist-${index}` }; // IDを付与
    });

    filteredGists = gists;
    applySyntaxHighlighting();
  }

  // タグに基づいてAND検索
  function filterGists() {
    if (tags.length === 0) {
      filteredGists = gists;
    } else {
      filteredGists = gists.filter((gist) => {
        return tags.every(tag => gist.title.includes(tag) || gist.description.includes(tag) || gist.codePreview.includes(tag));
      });
    }
  }

  // キーワードタグを追加してAND検索
  function addTag(event: KeyboardEvent) {
    if (event.key === 'Enter' && searchQuery.trim() !== "") {
      tags = [...tags, searchQuery.trim()];
      searchQuery = "";
      filterGists();
    }
  }

  // タグを削除
  function removeTag(index: number) {
    tags = tags.filter((_, i) => i !== index);
    filterGists();
  }

  // スクロールに応じて「最上部に戻る」ボタンを表示
  function handleScroll() {
    showScrollButton = window.scrollY > 300;
  }

  // 最上部に戻る
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // アンカーリンクのクリックでスムーズスクロール
  function scrollToAnchor(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onMount(() => {
    fetchGists();
    window.addEventListener('scroll', handleScroll); // スクロールイベント監視
  });
</script>

<!-- 検索フォーム -->
<section class="container mx-auto p-8">
  <div class="mb-6">
    <input
      type="text"
      class="border border-gray-300 rounded-lg p-2 w-full"
      placeholder="Search and press Enter"
      bind:value={searchQuery}
      on:keydown={addTag}
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

  <p class="text-center text-lg mb-8">
    このサイトは、ゆーちゃんのGitHub Gistsを集めたポートフォリオです。<br>
    各Gistの詳細やコードプレビューを確認することができます。<br>
    プロジェクトのアイデアを探しているときや、開発のヒントとして役立ててもらえると幸いです。<br>
  </p>

  <!-- Gistsの概要をテーブル形式で表示 -->
  <table class="table-auto w-full text-left border-collapse mb-12">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2">ファイル名</th>
        <th class="px-4 py-2">概要</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredGists as gist}
        <tr class="hover:bg-gray-50">
          <td class="border px-4 py-2">
            <a href="javascript:void(0)" on:click={() => scrollToAnchor(gist.id)} class="text-blue-600 hover:underline">{gist.title}</a>
          </td>
          <td class="border px-4 py-2">{gist.description || 'No description'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <!-- フィルタリングされたカードの表示 -->
  <div class="grid grid-cols-1 gap-8">
    {#each filteredGists as gist, i}
      <div id={gist.id} class="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-4">{gist.title}</h2>
          <p class="text-gray-600 mb-4">{gist.description || 'No description'}</p>

          <!-- 横並びのGist情報とアイコン -->
          <div class="flex space-x-4 text-sm text-gray-500">
            <span class="flex items-center">
              <FontAwesomeIcon icon={faStar} class="mr-1" /> {gist.stargazerCount}
            </span>
            <span class="flex items-center">
              <FontAwesomeIcon icon={faComment} class="mr-1" /> {gist.comments.totalCount}
            </span>
            <span class="flex items-center">
              <FontAwesomeIcon icon={faCodeBranch} class="mr-1" /> {gist.forks.totalCount}
            </span>
            <span class="flex items-center">
              <FontAwesomeIcon icon={faFile} class="mr-1" /> {gist.fileCount}
            </span>
            <span class="flex items-center">
              <FontAwesomeIcon icon={faCalendar} class="mr-1" /> {new Date(gist.createdAt).toLocaleDateString()}
            </span>
          </div>

          <a href={gist.url} target="_blank" class="text-blue-600 hover:underline mb-4 block">View on GitHub</a>

          <!-- コードプレビュー -->
          <h3 class="text-lg font-semibold mb-2">Code Preview ({gist.language}):</h3>
          <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto max-h-64 overflow-y-auto">
            <code class={`language-${gist.language}`}>
{gist.codePreview.trim()}</code>
          </pre>
        </div>
      </div>
    {/each}
  </div>

  <!-- 最上部に戻るボタン -->
  {#if showScrollButton}
    <button
      class="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
      on:click={scrollToTop}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  {/if}
</section>
