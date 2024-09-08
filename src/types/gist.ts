export interface Gist {
  owner: { login: string };
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
  title: string;
  codePreview: string;
  language: string;
  fileCount: number;
  id: string; // GistのID
}
