import type { NewsletterMaster } from '../types/newsletter';
import { trackingUrl } from './linkWrapper';

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&display=swap';

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

/**
 * 建構電子報 HTML，含字型嵌入與頁尾（診所名稱 + 退訂連結）[cite: 2026-02-08, 2026-02-12]
 */
export function buildNewsletterHtml(
  master: NewsletterMaster,
  urlToTrackingId: Record<string, string>,
  footer: { clinic_name: string; unsubscribe_base_url: string }
): string {
  const wrapUrl = (url: string): string => {
    const id = urlToTrackingId[url];
    return id ? trackingUrl(id) : url;
  };

  let bodyHtml = '';
  for (const b of master.blocks) {
    if (b.type === 'text') {
      bodyHtml += `<div class="block block-text">${escapeHtml((b as { content: string }).content).replace(/\n/g, '<br/>')}</div>`;
    } else if (b.type === 'image') {
      const img = b as { url: string; alt?: string };
      bodyHtml += `<div class="block block-image"><img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt ?? '')}" style="max-width:100%;height:auto;" /></div>`;
    } else if (b.type === 'booking_button') {
      const btn = b as { label: string; url: string };
      const href = wrapUrl(btn.url);
      bodyHtml += `<div class="block block-cta"><a href="${escapeHtml(href)}" class="cta-btn">${escapeHtml(btn.label)}</a></div>`;
    } else if (b.type === 'yijing') {
      const y = b as { title?: string; description?: string };
      bodyHtml += `<div class="block block-yijing"><h3>${escapeHtml(y.title ?? '易經算法運勢')}</h3><p>${escapeHtml(y.description ?? '')}</p></div>`;
    }
  }

  const footerHtml = `
    <div class="footer">
      <p class="clinic-name">${escapeHtml(footer.clinic_name)}</p>
      ${footer.unsubscribe_base_url ? `<p><a href="${escapeHtml(footer.unsubscribe_base_url)}" class="unsubscribe">退訂電子報</a></p>` : ''}
    </div>`;

  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="${FONT_CSS}" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Noto Serif TC', serif; margin: 0; padding: 24px; background: #f8f7f3; color: #1a202c; line-height: 1.6; }
    .container { max-width: 560px; margin: 0 auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .block { margin-bottom: 16px; }
    .block-text { white-space: pre-wrap; }
    .cta-btn { display: inline-block; padding: 12px 24px; background: #1a434e; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .clinic-name { font-weight: 600; color: #1a434e; }
    .unsubscribe { color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    ${bodyHtml}
    ${footerHtml}
  </div>
</body>
</html>`;
}
