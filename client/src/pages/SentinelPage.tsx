import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';

const PARAMS = [
  { key: 'heaven', label: '天 (Heaven)', en: 'Heaven' },
  { key: 'earth', label: '地 (Earth)', en: 'Earth' },
  { key: 'man', label: '人 (Man)', en: 'Man' },
] as const;

export default function SentinelPage() {
  const [heaven, setHeaven] = useState(50);
  const [earth, setEarth] = useState(50);
  const [man, setMan] = useState(50);

  const values = { heaven, earth, man };

  const handleInitialize = () => {
    console.log('Inputs captured', { heaven, earth, man });
    alert('Core Model Pending...');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-12 pb-12 px-6"
      style={{
        background: BG,
        color: ZINC,
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.08), transparent)',
      }}
    >
      <header className="w-full max-w-2xl flex justify-between items-center mb-12">
        <Link
          to="/"
          className="text-sm"
          style={{ color: ZINC, opacity: 0.8, textDecoration: 'none' }}
        >
          ← 返回首頁
        </Link>
        <h1
          className="text-xl font-bold tracking-wider"
          style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}
        >
          SENTINEL 運算介面
        </h1>
        <span style={{ width: 80 }} />
      </header>

      <main className="w-full max-w-2xl space-y-10">
        {/* Input 輸入區 */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <h2 className="text-sm font-mono tracking-wider mb-6" style={{ color: GOLD }}>
            INPUT 輸入
          </h2>
          {PARAMS.map(({ key, label }) => (
            <div key={key} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm" style={{ color: ZINC }}>
                  {label}
                </label>
                <span className="text-sm font-mono" style={{ color: GOLD }}>
                  {values[key]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={values[key]}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (key === 'heaven') setHeaven(v);
                  if (key === 'earth') setEarth(v);
                  if (key === 'man') setMan(v);
                }}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${GOLD} 0%, ${GOLD} ${values[key]}%, rgba(255,255,255,0.1) ${values[key]}%, rgba(255,255,255,0.1) 100%)`,
                }}
              />
            </div>
          ))}
        </section>

        {/* Output 輸出區 */}
        <section
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <h2 className="text-sm font-mono tracking-wider mb-4" style={{ color: GOLD }}>
            OUTPUT 輸出
          </h2>
          <p className="text-sm mb-2" style={{ color: ZINC, opacity: 0.8 }}>
            狀態
          </p>
          <p className="text-sm font-medium mb-6" style={{ color: ZINC }}>
            未啟動 (Offline)
          </p>
          <p className="text-xs uppercase tracking-tight mb-1" style={{ color: ZINC, opacity: 0.8 }}>
            共振指數 Resonance
          </p>
          <p className="text-3xl font-mono" style={{ color: GOLD }}>
            --.--
          </p>
        </section>

        {/* 按鈕 */}
        <button
          type="button"
          onClick={handleInitialize}
          className="w-full py-4 rounded-xl font-medium text-sm tracking-wider"
          style={{
            background: 'linear-gradient(145deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.08) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: GOLD,
            cursor: 'pointer',
          }}
        >
          初始化序列 (Initialize Sequence)
        </button>
      </main>
    </div>
  );
}
