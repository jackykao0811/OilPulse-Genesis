import React from 'react';
import { Link } from 'react-router-dom';

const GOLD = '#D4AF37';
const BG = '#050505';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: BG }}
    >
      {/* Hero - Fade-in */}
      <section className="opacity-0 animate-fade-in-up text-center" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <h1
          className="text-5xl md:text-7xl font-bold tracking-widest"
          style={{ fontFamily: 'serif', color: GOLD }}
        >
          HETUYI
        </h1>
        <p className="text-xs text-gray-400 mt-4 tracking-wide">
          以 易 數 · 解 構 · 生 命
        </p>
      </section>

      {/* Gates - Three cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
      >
        <Link
          to="/apply"
          className="py-8 px-6 text-center rounded-lg border transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
          style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD }}
        >
          <span className="text-sm font-medium tracking-widest">[ CLINIC OS ]</span>
        </Link>
        <a
          href="/research"
          className="py-8 px-6 text-center rounded-lg border transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
          style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD }}
        >
          <span className="text-sm font-medium tracking-widest">[ SENTINEL ]</span>
        </a>
        <a
          href="/blog"
          className="py-8 px-6 text-center rounded-lg border transition-all duration-300 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
          style={{ borderColor: 'rgba(212,175,55,0.3)', color: GOLD }}
        >
          <span className="text-sm font-medium tracking-widest">[ ACADEMY ]</span>
        </a>
      </section>

      {/* Footer - Fixed bottom, OilPulse 訂閱框 */}
      <footer
        className="fixed bottom-0 left-0 right-0 py-4 px-6 flex justify-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'forwards', background: 'rgba(5,5,5,0.9)' }}
      >
        <div className="flex gap-2 max-w-md w-full">
          <input
            type="email"
            placeholder="訂閱 OilPulse"
            className="flex-1 py-2.5 px-4 rounded-lg text-sm bg-transparent border outline-none"
            style={{ borderColor: 'rgba(212,175,55,0.3)', color: '#e4e4e7' }}
          />
          <button
            type="button"
            className="py-2.5 px-5 rounded-lg text-sm font-medium"
            style={{ background: GOLD, color: BG, border: 'none', cursor: 'pointer' }}
          >
            訂閱
          </button>
        </div>
      </footer>
    </div>
  );
}
