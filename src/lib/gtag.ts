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

// gtagをグローバル変数として宣言
declare global {
  interface Window {
    gtag: Gtag;
  }
}

// gtag関数を定義
export function gtag(
  command: 'config' | 'event',
  action: string,
  params?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    if (command === 'config') {
      window.gtag('config', action, params);
    } else if (command === 'event') {
      window.gtag('event', action, params);
    } else {
      console.warn('Invalid gtag command');
    }
  } else {
    console.warn('gtag is not available');
  }
}