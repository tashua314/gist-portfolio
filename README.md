# ゆーちゃんのGistsポートフォリオ

このプロジェクトは、ゆーちゃんのGitHub Gistsを集めたポートフォリオサイトです。Svelteを使用して構築されており、ユーザーがGistの一覧を確認し、詳細やコードプレビューを閲覧できるようにしています。

## サービスの概要

このサイトでは、以下の機能を提供しています：
- GitHub Gistsの一覧表示
- 各Gistの詳細情報とコードプレビューの表示
- キーワード検索によるGistのフィルタリング
- スクロールに応じた「最上部に戻る」ボタンの表示
- GAイベント設置

## 工夫したこと

### Gistの一覧をスクリプトで取得
GistsはJSONファイルから動的に取得され、Prism.jsを使用してコードのシンタックスハイライトを適用しています。
この方法を採用した理由は、APIトークンを隠蔽化し、セキュリティを確保するためです。
さらに、動的にデータを取得することで、初期ロード時間を短縮し、ユーザーエクスペリエンスを向上させることができます。

### Google Analyticsの統合
ユーザーの操作（タグ追加、アンカーリンクのクリック、スクロールなど）に応じてGoogle Analyticsイベントを送信し、ユーザーの行動をトラッキングしています。

## 実行方法

1. このリポジトリをクローンします：
   ```bash
   git clone https://github.com/tashua314/gist-portfolio.git
   ```

2. プロジェクトのディレクトリに移動します：
   ```bash
   cd gist-portfolio
   ```

3. 依存関係をインストールします：
   ```bash
   npm install
   ```

4. GitHubからPersonal Access Tokenを取得し、`.env`ファイルに`GET_GIST_TOKEN`を設定します：

   1. GitHubにログインします。
   2. 右上のプロフィールアイコンをクリックし、「Settings」を選択します。
   3. 左側のメニューから「Developer settings」を選択します。
   4. 「Personal access tokens」をクリックし、「Tokens (classic)」を選択します。
   5. 「Generate new token」をクリックします。
   6. トークンに名前を付け、必要なスコープ（例：`gist`）を選択します。
   7. 「Generate token」をクリックし、表示されたトークンをコピーします。

   8. プロジェクトのルートディレクトリに`.env`ファイルを作成し、以下のように設定します：
   ```
   GET_GIST_TOKEN=your_github_token_here
   ```

5. Gistsを取得し、`static/gists.json`に出力します：
   ```bash
   npm run fetch-gists
   ```

6. 開発サーバーを起動します：
   ```bash
   npm run dev
   ```

7. ブラウザで以下のURLにアクセスします：
   ```
   http://localhost:5173
   ```

これで、ローカル環境でプロジェクトを実行することができます。