// fetchGists.ts
import fetch from 'node-fetch';
import * as fs from 'fs';
import dotenv from 'dotenv';

console.log('Gistsを取得します...');

// .envファイルの内容をローカル環境で読み込む
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();  // ローカル環境でのみ実行
}

const token: string | undefined = process.env.GET_GIST_TOKEN;
if (!token) {
  throw new Error('GET_GIST_TOKENが設定されていません。');
}

// GraphQLクエリ。ページネーションのためにcursorとhasNextPageを取得
const query = `
  query ($cursor: String) {
    viewer {
      gists(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          description
          files {
            name
            text
            language { name }
          }
          stargazerCount
          createdAt
          comments {
            totalCount
          }
          forks {
            totalCount
          }
          url
          owner {
            login
          }
        }
      }
    }
  }
`;

interface Gist {
  description: string;
  files: Array<{
    name: string;
    text: string;
    language: { name: string } | null;
  }>;
  stargazerCount: number;
  createdAt: string;
  comments: { totalCount: number };
  forks: { totalCount: number };
  url: string;
  owner: {
    login: string;
  };
}

async function fetchAllGists(): Promise<void> {
  let gists: Gist[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    // GitHub GraphQL APIへのリクエスト
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query,
        variables: { cursor }
      })
    });

    const json = await response.json() as { data?: { viewer?: { gists?: any } } };

    if (!json.data || !json.data?.viewer?.gists) {
      console.error('データ取得に失敗しました。', json);
      return;
    }

    const { nodes, pageInfo } = json.data.viewer.gists;
    gists = [...gists, ...nodes];  // 新たなGistsを蓄積

    // ページネーション情報を更新
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  // 取得したデータをJSONファイルとして保存
  fs.writeFileSync('static/gists.json', JSON.stringify(gists, null, 2));
  console.log(`全てのGistsを取得し、gists.jsonに保存しました。 (${gists.length}件)`);
}

fetchAllGists();
