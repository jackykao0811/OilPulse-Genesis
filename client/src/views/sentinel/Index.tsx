import React from 'react';
import { Link } from 'react-router-dom';

const NEON = '#00ff88';
const GOLD = '#D4AF37';
const BG = '#0a0a0a';

/**
 * Sentinel 子系統首頁：極黑/霓虹綠終端機風格，雷達/儀表板 placeholder。
 */
export default function SentinelIndex() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 font-mono"
      style={{
        background: BG,
        color: NEON,
        boxShadow: 'inset 0 0 120px rgba(0,255,136,0.03)',
      }}
    >
      <div className="w-full max-w-2xl space-y-8">
        <header className="flex justify-between items-center border-b pb-4" style={{ borderColor: 'rgba(0,255,136,0.2)' }}>
          <Link to="/" className="text-sm hover:underline" style={{ color: NEON, opacity: 0.8 }}>
            ← EXIT TO LANDING
          </Link>
          <span className="text-xs tracking-widest" style={{ color: GOLD }}>SENTINEL CORE</span>
        </header>

        <section className="space-y-4">
          <p className="text-sm tracking-wider opacity-90">$ status</p>
          <p className="text-lg font-semibold" style={{ color: NEON, textShadow: '0 0 20px rgba(0,255,136,0.4)' }}>
            System Online
          </p>
          <p className="text-sm opacity-70">Awaiting Data</p>
        </section>

        <section
          className="rounded-lg p-6 border"
          style={{
            borderColor: 'rgba(0,255,136,0.15)',
            background: 'rgba(0,255,136,0.02)',
          }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: NEON, opacity: 0.7 }}>
            [ RADAR PLACEHOLDER ]
          </p>
          <div className="h-48 flex items-center justify-center rounded border border-dashed" style={{ borderColor: 'rgba(0,255,136,0.2)' }}>
            <span className="text-sm" style={{ color: NEON, opacity: 0.5 }}>數據儀表板 · 即將上線</span>
          </div>
        </section>

        <footer className="pt-6 border-t" style={{ borderColor: 'rgba(0,255,136,0.1)' }}>
          <Link
            to="/sentinel/run"
            className="inline-block py-2 px-4 rounded text-sm border transition-colors"
            style={{ borderColor: NEON, color: NEON }}
          >
            進入 SENTINEL 運算介面 →
          </Link>
        </footer>
      </div>
    </div>
  );
}
