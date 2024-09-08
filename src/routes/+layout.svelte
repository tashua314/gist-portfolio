<script>
// global styling
import '../app.css';
import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Analytics from '$lib/ga.svelte'

let title = "ゆーちゃん's Gists Portfolio";
let description = 'ゆーちゃんのGitHub Gistsを集めたポートフォリオサイトです。';
</script>

<svelte:head>
  <!-- ページタイトル -->
  <title>{title}</title>

  <!-- メタデータ -->
  <meta name="description" content="{description}" />

  <!-- Open Graph (OG) Tags -->
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tashua314.github.io/gist-portfolio/" />
  <meta property="og:image" content="card.jpg" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:site" content="@tashua314"> <!-- Xアカウントのユーザー名 -->
  <meta name="twitter:image" content="card.jpg" />

  <!-- Viewport設定 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <Analytics />
</svelte:head>

<header class="bg-blue-600 p-4 shadow-md">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-white text-2xl font-bold">
      ゆーちゃん's Gists Portfolio
    </h1>
    <nav class="space-x-4 flex items-center">
      <!-- GitHubリンク -->
      <a href="https://github.com/tashua314/gist-portfolio" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 text-lg" aria-label="GitHub">
        <FontAwesomeIcon icon={faGithub} class="fa-2x" />
      </a>
      <!-- Xへのリンク -->
      <a href="https://twitter.com/tashua314" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 text-lg">
        <FontAwesomeIcon icon={faTwitter} class="fa-2x" />
      </a>

      <!-- litlinkへのリンク -->
      <a href="https://lit.link/yuchan314" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-300 text-lg">
        <div class="profile-icon">
          <FontAwesomeIcon icon={faUser} class="fa-lg" />
        </div>
      </a>
    </nav>
  </div>
</header>

<main class="mt-4">
  <slot></slot>
</main>

<style>
  header {
    background-color: #1DA1F2; /* X（旧Twitter）の色 */
  }

  a {
    transition: color 0.2s;
  }

  .profile-icon {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 2px solid white; /* 枠線のみ白 */
    border-radius: 50%; /* 丸で囲む */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
  }
</style>