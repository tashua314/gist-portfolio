// Google Analyticsのgtag関数の型定義
interface Gtag {
  (command: 'config', targetId: string, config?: Record<string, any>): void;
  (
    command: 'event',
    eventName: string,
    eventParams?: {
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ): void;
}

// グローバルにgtagを宣言
declare var gtag: Gtag;

export {};