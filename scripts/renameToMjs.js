import { promises as fs } from 'fs';
import path from 'path';

console.log('ファイルのリネームを開始します...');
const dir = path.resolve('dist/scripts');  // dist/scripts ディレクトリをターゲット

async function renameFiles() {
  try {
    // scriptsフォルダが無かったら生成する
    await fs.mkdir(dir, { recursive: true });

    const files = await fs.readdir(dir);
    console.log('ディレクトリ内のファイル:', files);  // デバッグ用

    for (const file of files) {
      if (file.endsWith('.js')) {
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, file.replace('.js', '.mjs'));
        console.log(`リネーム前: ${oldPath}, リネーム後: ${newPath}`);  // デバッグ用
        await fs.rename(oldPath, newPath);
        console.log(`Renamed ${file} to ${file.replace('.js', '.mjs')}`);
      } else {
        console.log(`スキップされたファイル: ${file}`);  // デバッグ用
      }
    }
  } catch (error) {
    console.error('Error renaming files:', error);
  }
}

renameFiles();
