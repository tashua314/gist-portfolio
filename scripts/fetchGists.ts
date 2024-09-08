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

const query: string = `
  query {
    viewer {
      gists(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
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

async function fetchGists(): Promise<void> {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  const json = await response.json();

  // 取得したデータをJSONファイルとして保存
  fs.writeFileSync('static/gists.json', JSON.stringify(json, null, 2));
  console.log('Gists fetched and saved to gists.json');
}

fetchGists();
