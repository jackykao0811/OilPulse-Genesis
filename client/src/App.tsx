import React, { useEffect } from 'react';
import masterConfig from './MasterConfig.json';

// 核心算力引擎
const calculateQiResonance = (data: number[]) => {
  return data.reduce((acc, v) => acc + (v * 1.618), 0).toFixed(4);
};

export default function HeTuApp() {
  const config = masterConfig.truth_source.hetu_hq;

  useEffect(() => {
    if (!(window as any)._HETU_IGNITED) {
      console.log('HeTu Core System Ignited on iMac.');
      (window as any)._HETU_IGNITED = true;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&display=swap');
        .font-hetu { font-family: 'Noto Serif TC', serif; }
      `}</style>
      <main className="max-w-4xl text-center font-hetu">
        <h1 className="text-6xl font-bold mb-6 tracking-widest text-[#D4AF37]">
          {config.name}
        </h1>
        <p className="text-xl text-stone-400 mb-12 italic">{config.vision}</p>

        <div className="border border-stone-800 p-8 rounded-lg bg-stone-900/30">
          <p className="text-xs uppercase tracking-tighter text-stone-500 mb-2">Sentinel Alpha Engine Status</p>
          <div className="text-3xl font-mono text-[#D4AF37]">
            RESONANCE: {calculateQiResonance([1, 0, 1])}
          </div>
        </div>

        <footer className="mt-24 text-stone-600 text-sm">
          Founder: {config.founder}
        </footer>
      </main>
    </div>
  );
}
