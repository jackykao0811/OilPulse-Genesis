/**
 * LinkWrapper：醫師設定的連結自動改寫為 t.hetu-system.web.app/t/:linkId
 * 點擊後由後端異步記錄，再跳轉至醫師預設頁面 [cite: 2026-02-12]
 */
export const TRACKING_BASE = 'https://t.hetu-system.web.app';

export function trackingUrl(trackingId: string): string {
  return `${TRACKING_BASE}/t/${trackingId}`;
}

export function extractUrlsFromHtml(html: string): string[] {
  const re = /href=["'](https?:\/\/[^"']+)["']/gi;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    set.add(m[1].trim());
  }
  return Array.from(set);
}

export function replaceUrlsInHtml(
  html: string,
  mapping: Record<string, string>
): string {
  let out = html;
  for (const [url, id] of Object.entries(mapping)) {
    const safeUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(`href=["']${safeUrl}["']`, 'gi'), `href="${trackingUrl(id)}"`);
  }
  return out;
}

export function extractUrlsFromBlocks(blocks: { type: string; url?: string }[]): string[] {
  const urls: string[] = [];
  for (const b of blocks) {
    if (b.url && /^https?:\/\//i.test(b.url)) urls.push(b.url);
  }
  return Array.from(new Set(urls));
}
