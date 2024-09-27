<script lang="ts">
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import 'prismjs/themes/prism.css';
  import Prism from 'prismjs';

  // Font Awesomeアイコンのインポート
  import { faStar, faComment, faCodeBranch, faCalendar, faFile, faArrowUp } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import type { Gist } from '../types/gist';
	import SearchForm from '../components/SearchForm.svelte';

  let gists: Gist[] = [];

  let filteredGists = gists;
  let searchQuery = "";
  let tags: string[] = [];
  let showScrollButton = false; // 最上部に戻るボタンの表示管理
  const scrollSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  // 各スクロール率に達成したかどうかのflag
  const hasTrackedScroll: { [key: number]: boolean } = {};

  // Prism.jsを動的にインポートして、クライアントサイドで使用
  async function applySyntaxHighlighting() {
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
    // @ts-ignore
    await import('prismjs/components/prism-coffeescript');
    Prism.highlightAll();
  }

  // JSONファイルからGistsを取得
  async function fetchGists() {
    const response = await fetch(`${base}/gists.json`);
    const json = await response.json();
    gists = json.map((gist: Gist, index: number) => {
      const title = gist.files.length > 0 ? `${gist.owner.login}/${gist.files[0].name}` : 'No Title';
      const codePreview = gist.files.length > 0 ? gist.files[0].text : 'No Code Available';
      const language = gist.files.length > 0 && gist.files[0].language ? gist.files[0].language.name.toLowerCase() : 'plaintext';
      const fileCount = gist.files.length;
      return { ...gist, title, codePreview, language, fileCount, id: `gist-${index}` }; // IDをGistのIDに変更
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
        return tags.every(tag => {
          const lowerTag = tag.toLowerCase();
          return gist.title.toLowerCase().includes(lowerTag) ||
                 gist.description.toLowerCase().includes(lowerTag) ||
                 gist.codePreview.toLowerCase().includes(lowerTag);
        });
      });
    }
  }

  // キーワードタグを追加してAND検索
  function addTag(event: KeyboardEvent) {
    if (event.key === 'Enter' && searchQuery.trim() !== "") {
      tags = [...tags, searchQuery.trim().toLocaleLowerCase()];
      // Google Analytics イベント送信
      gtag('event', 'add_tag', {
        event_category: 'search',
        event_label: searchQuery.trim().toLocaleLowerCase(),
        value: 1
      });
      searchQuery = "";
      filterGists();
    }
  }

  // タグを削除
  function removeTag(index: number) {
    tags = tags.filter((_, i) => i !== index);
    filterGists();
  }

  // デフォルトタグのリスト
  const defaultTags = ["svelte", "python", "javascript", "jquery", "bootstrap", "vue", "html", "coffeescript", "ctags", "mecab", "github", "wscript", "node", "pillow", "langchain", "chatopenai"]


;

  // デフォルトタグを追加する関数
  function addDefaultTag(tag: string) {
    const lowerTag = tag.toLowerCase();
    if (!tags.includes(lowerTag)) {
      tags = [...tags, lowerTag];
      // Google Analytics イベント送信
      gtag('event', 'add_tag', {
        event_category: 'search',
        event_label: lowerTag,
        value: 1
      });
      filterGists();
    }
  }

  // スクロールに応じて「最上部に戻る」ボタンを表示
  function handleScroll() {
    showScrollButton = window.scrollY > 300;
  }

  // 最上部に戻る
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
     // GAイベント送信
     gtag('event', 'click_back_to_top', {
       event_category: 'navigation',
       event_label: 'back_to_top'
     });
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
    window.addEventListener('scroll', () => {
      handleScroll();
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
      scrollSteps.forEach(step => {
        if (scrollPercentage > step && !hasTrackedScroll[step]) {
          // GAイベント送信
          gtag('event', 'scroll', {
            event_category: 'interaction',
            event_label: `scroll_${step}_percent`
          });
          hasTrackedScroll[step] = true;
        }
      });
    });
  });

  function handleAnchorClick(id: string) {
    scrollToAnchor(id);
    // GAイベント送信
    gtag('event', 'click_anchor', {
      event_category: 'navigation',
      event_label: gists.find(gist => gist.id === id)?.title || id
    });
  }
</script>

<!-- 検索フォーム -->
<section class="container mx-auto p-8">
  <!-- デフォルトタグの表示 -->
  <div class="mb-4">
    {#each defaultTags as tag}
      <button
        class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-300"
        on:click={() => addDefaultTag(tag)}
      >
        {tag}
      </button>
    {/each}
  </div>

  <!-- 検索フォームコンポーネント -->
  <SearchForm
    bind:searchQuery
    {tags}
    {addTag}
    {removeTag}
  />

  {#if tags.length === 0}
    <p class="text-center text-lg mb-8">
      このサイトは、ゆーちゃんのGitHub Gistsを集めたポートフォリオです。<br>
      各Gistの詳細やコードプレビューを確認することができます。<br>
      プロジェクトのアイデアを探しているときや、開発のヒントとして役立ててもらえると幸いです。<br>
    </p>
  {/if}

<!-- Gistsの概要を表示 -->
<div class="mb-12 border rounded-lg overflow-hidden">
  {#each filteredGists as gist, i}
    <div class={`border-b p-4 ${i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
      <div class="md:flex md:justify-between md:items-center">
        <div class="md:w-1/2">
          <button on:click={() => handleAnchorClick(gist.id)} class="text-blue-600 hover:underline bg-transparent border-none cursor-pointer">{gist.title}</button>
        </div>
        <div class="md:w-1/2 mt-2 md:mt-0">
          {gist.description || 'No description'}
        </div>
      </div>
    </div>
  {/each}
</div>

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

          <a href={gist.url} target="_blank" class="text-blue-600 hover:underline mb-4 block"
          on:click={() => gtag('event', 'click_gist_link', {
            event_category: 'gist',
            event_label: gist.title
          })}>View on GitHub</a>

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
