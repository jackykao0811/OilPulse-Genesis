import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import masterConfig from '../MasterConfig.json';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';

const calculateQiResonance = (data: number[]) => {
  return data.reduce((acc, v) => acc + (v * 1.618), 0).toFixed(4);
};

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconDroplet() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M8 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}

export default function MainDashboardContent() {
  const config = masterConfig.truth_source.hetu_hq;
  const resonance = calculateQiResonance([1, 0, 1]);

  useEffect(() => {
    if (!(window as any)._HETU_IGNITED) {
      console.log('HeTu Core System Ignited on iMac.');
      (window as any)._HETU_IGNITED = true;
    }
  }, []);

  return (
    <>
      <section className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <h1
          className="text-5xl md:text-6xl font-bold tracking-widest mb-4"
          style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}
        >
          {config.name}
        </h1>
        <p className="text-lg md:text-xl mb-16" style={{ color: ZINC, fontFamily: 'system-ui, sans-serif' }}>
          {config.vision}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <article
          className="glass rounded-2xl p-6 text-left opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ color: GOLD }}>
            <IconShield />
            <span className="font-mono text-sm tracking-wider">SENTINEL 哨兵系統</span>
          </div>
          <p className="text-xs uppercase tracking-tight mb-2" style={{ color: ZINC, opacity: 0.8 }}>狀態</p>
          <p className="text-sm font-medium mb-4" style={{ color: GOLD }}>運作中</p>
          <p className="text-sm mb-3" style={{ color: ZINC }}>{masterConfig.sentinel?.description || '哨兵邏輯：監控、稽核、冪等性守衛'}</p>
          <div className="text-2xl font-mono mb-4" style={{ color: GOLD }}>RESONANCE: {resonance}</div>
          <Link to="/sentinel/run" className="text-sm underline" style={{ color: GOLD }}>
            進入 SENTINEL 運算介面 →
          </Link>
        </article>

        <article
          className="glass rounded-2xl p-6 text-left opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ color: GOLD }}>
            <IconDroplet />
            <span className="font-mono text-sm tracking-wider">OilPulse 油脈</span>
          </div>
          <p className="text-xs uppercase tracking-tight mb-2" style={{ color: ZINC, opacity: 0.8 }}>狀態</p>
          <p className="text-sm font-medium mb-4" style={{ color: ZINC }}>開發中</p>
          <p className="text-sm" style={{ color: ZINC }}>精油與經絡的數位介面</p>
        </article>

        <article
          className="glass rounded-2xl p-6 text-left opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ color: GOLD }}>
            <IconBuilding />
            <span className="font-mono text-sm tracking-wider">Clinic OS 診所中樞</span>
          </div>
          <p className="text-xs uppercase tracking-tight mb-2" style={{ color: ZINC, opacity: 0.8 }}>狀態</p>
          <p className="text-sm font-medium mb-4" style={{ color: ZINC }}>待機中</p>
          <p className="text-sm mb-4" style={{ color: ZINC }}>多租戶管理系統</p>
          <Link to="/clinic/app" className="text-sm underline" style={{ color: GOLD }}>進入 Clinic OS →</Link>
        </article>
      </section>

      <section className="mb-20">
        <h2 className="text-sm font-mono tracking-wider mb-6 text-center" style={{ color: GOLD }}>電子報生態閉環</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/profile" className="glass rounded-2xl p-5 text-left block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', color: ZINC, textDecoration: 'none' }}>
            <span className="text-lg mb-2 block">⚙️</span>
            <span className="font-medium" style={{ color: GOLD }}>醫師設定檔</span>
            <p className="text-xs mt-1" style={{ opacity: 0.8 }}>clinicName · bookingUrl · 簽名檔</p>
          </Link>
          <Link to="/audience" className="glass rounded-2xl p-5 text-left block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.55s', animationFillMode: 'forwards', color: ZINC, textDecoration: 'none' }}>
            <span className="text-lg mb-2 block">📋</span>
            <span className="font-medium" style={{ color: GOLD }}>名單金庫</span>
            <p className="text-xs mt-1" style={{ opacity: 0.8 }}>CSV 導入 / 導出 · 病患列表</p>
          </Link>
          <Link to="/dashboard" className="glass rounded-2xl p-5 text-left block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards', color: ZINC, textDecoration: 'none' }}>
            <span className="text-lg mb-2 block">📊</span>
            <span className="font-medium" style={{ color: GOLD }}>轉換漏斗</span>
            <p className="text-xs mt-1" style={{ opacity: 0.8 }}>Sent → Opened → Clicked → Converted</p>
          </Link>
          <Link to="/editor" className="glass rounded-2xl p-5 text-left block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.65s', animationFillMode: 'forwards', color: ZINC, textDecoration: 'none' }}>
            <span className="text-lg mb-2 block">✏️</span>
            <span className="font-medium" style={{ color: GOLD }}>編輯器</span>
            <p className="text-xs mt-1" style={{ opacity: 0.8 }}>Smart Blocks · 模組組裝</p>
          </Link>
        </div>
      </section>

      <footer
        className="opacity-0 animate-fade-in-up text-sm"
        style={{ animationDelay: '0.8s', animationFillMode: 'forwards', color: ZINC, opacity: 0.7 }}
      >
        <p>Founder: {config.founder}</p>
        <p className="mt-2">© {new Date().getFullYear()} 河圖科技 HeTu Core. All rights reserved.</p>
      </footer>
    </>
  );
}
