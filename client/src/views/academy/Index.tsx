import React from 'react';
import { Link } from 'react-router-dom';

const TEXT = '#1a1a1a';
const MUTED = '#6b7280';
const BORDER = '#e5e7eb';

/**
 * Academy 子系統首頁：Medium/Substack 閱讀風格，襯線體，高雅排版。
 */
export default function AcademyIndex() {
  const placeholderArticles = [
    { id: 1, title: '易數與生命解構', excerpt: '以河圖洛書為本，重新理解時間與經絡的對應關係。', date: '2025.02' },
    { id: 2, title: '精油與經絡入門', excerpt: '從經絡學看精油選方與日常保健。', date: '2025.01' },
    { id: 3, title: '診所數位轉型筆記', excerpt: '實務經驗：預約、名單與電子報的閉環。', date: '2024.12' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center py-16 px-6"
      style={{
        background: '#fafafa',
        color: TEXT,
        fontFamily: '"Noto Serif TC", "Georgia", serif',
      }}
    >
      <div className="w-full max-w-2xl">
        <header className="mb-16 text-center">
          <Link to="/" className="text-sm mb-6 inline-block" style={{ color: MUTED, textDecoration: 'none' }}>
            ← 返回首頁
          </Link>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3" style={{ color: TEXT }}>
            Academy
          </h1>
          <p className="text-lg" style={{ color: MUTED }}>
            河圖書院 · 以易數解構生命
          </p>
        </header>

        <section className="space-y-12">
          <h2 className="text-xs uppercase tracking-widest" style={{ color: MUTED }}>精選文章</h2>
          <ul className="space-y-10">
            {placeholderArticles.map((article) => (
              <li key={article.id}>
                <Link
                  to="/academy"
                  className="block group"
                  style={{ color: TEXT, textDecoration: 'none' }}
                >
                  <p className="text-sm mb-1" style={{ color: MUTED }}>{article.date}</p>
                  <h3 className="text-2xl font-medium mb-2 group-hover:underline" style={{ color: TEXT }}>
                    {article.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: MUTED }}>
                    {article.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-20 pt-8 border-t text-center text-sm" style={{ borderColor: BORDER, color: MUTED }}>
          <p>更多課程與文章即將上線</p>
          <p className="mt-2">© {new Date().getFullYear()} 河圖科技 HeTu Core</p>
        </footer>
      </div>
    </div>
  );
}
