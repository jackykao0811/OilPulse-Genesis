import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';

const BLOCKS = [
  { id: 'alert', icon: '🚑', title: '節氣/疫情警報', desc: 'Seasonal Alert' },
  { id: 'case', icon: '📖', title: '個案故事', desc: 'Case Study' },
  { id: 'booking', icon: '🔗', title: '一鍵掛號', desc: 'Magic Booking', badge: '自動連結至 Profile.bookingUrl' },
];

export default function EditorPage() {
  const { profile } = useProfile();
  const bookingUrl = profile.bookingUrl || '[尚未設定]';

  return (
    <div className="min-h-screen flex pt-12 pb-12 px-6" style={{ background: BG, color: ZINC, backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.06), transparent)' }}>
      <header className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" className="text-sm" style={{ color: ZINC, opacity: 0.8, textDecoration: 'none' }}>← 返回</Link>
        <h1 className="text-lg font-bold tracking-wider" style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}>電子報編輯器</h1>
        <span style={{ width: 60 }} />
      </header>

      <aside className="w-56 shrink-0 mr-8">
        <div
          className="rounded-2xl p-4 opacity-0 animate-fade-in-up"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', animationFillMode: 'forwards' }}
        >
          <h2 className="text-xs font-mono tracking-wider mb-4" style={{ color: GOLD }}>Smart Blocks</h2>
          <ul className="space-y-2">
            {BLOCKS.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  className="w-full text-left py-3 px-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: ZINC,
                    cursor: 'pointer',
                  }}
                >
                  <span className="mr-2">{b.icon}</span>
                  <span className="font-medium">{b.title}</span>
                  <span className="block text-xs mt-1" style={{ opacity: 0.7 }}>{b.desc}</span>
                  {b.badge && (
                    <span className="block text-xs mt-1" style={{ color: GOLD }}>{b.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs" style={{ color: ZINC, opacity: 0.6 }}>
          bookingUrl: {bookingUrl}
        </p>
      </aside>

      <main className="flex-1 rounded-2xl p-8 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(212,175,55,0.2)' }}>
        <p className="text-sm" style={{ color: ZINC, opacity: 0.6 }}>拖放 Smart Block 至此組裝電子報（編輯器預備架構）</p>
      </main>
    </div>
  );
}
