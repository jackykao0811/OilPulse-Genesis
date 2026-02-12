import React from 'react';
import { Link } from 'react-router-dom';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Cell } from 'recharts';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';

const funnelData = [
  { name: '發送數 Sent', value: 1000, fill: 'rgba(212,175,55,0.5)', rate: '100%' },
  { name: '開信數 Opened', value: 620, fill: 'rgba(212,175,55,0.4)', rate: '62%' },
  { name: '點擊數 Clicked', value: 280, fill: 'rgba(212,175,55,0.3)', rate: '28%' },
  { name: '掛號轉換 Converted', value: 89, fill: 'rgba(212,175,55,0.8)', rate: '8.9%' },
];

const hotspotRanking = [
  { module: '流感警報', conversion: 12.4 },
  { module: '優惠券', conversion: 9.2 },
  { module: '節氣養生', conversion: 7.1 },
  { module: '個案故事', conversion: 5.8 },
  { module: '一鍵掛號', conversion: 4.2 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen pt-12 pb-12 px-6" style={{ background: BG, color: ZINC, backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.08), transparent)' }}>
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <Link to="/" className="text-sm" style={{ color: ZINC, opacity: 0.8, textDecoration: 'none' }}>← 返回</Link>
        <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}>轉換漏斗儀表板</h1>
        <span style={{ width: 60 }} />
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        {/* Funnel */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <h2 className="text-sm font-mono tracking-wider mb-6" style={{ color: GOLD }}>電子報轉換漏斗 Conversion Funnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="right" fill={ZINC} stroke="none" dataKey="name" />
                  <LabelList position="right" fill={GOLD} stroke="none" dataKey="rate" />
                  {funnelData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspot */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <h2 className="text-sm font-mono tracking-wider mb-4" style={{ color: GOLD }}>最高效能模組</h2>
          <ul className="space-y-3">
            {hotspotRanking.map((row) => (
              <li
                key={row.module}
                className="flex justify-between items-center py-2 px-3 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span style={{ color: ZINC }}>{row.module}</span>
                <span style={{ color: GOLD, fontFamily: 'monospace' }}>{row.conversion}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
