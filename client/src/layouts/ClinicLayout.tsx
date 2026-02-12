import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useClinic } from '../context/ClinicContext';
import { useAuth } from '../core/hetu/auth/AuthContext';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';
const CARD_BG = '#18181b';

export default function ClinicLayout() {
  const { currentClinic, clinics, switchClinic, isStaff } = useClinic();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG, color: ZINC }}>
      <nav
        className="flex items-center justify-between h-14 px-6 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: CARD_BG }}
      >
        <Link to="/clinic" className="text-base font-semibold tracking-wide" style={{ color: GOLD, textDecoration: 'none' }}>
          Clinic OS
        </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 py-2 px-4 rounded-lg min-w-[200px] justify-center transition-all duration-200"
            style={{
              background: dropdownOpen ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: GOLD,
              cursor: 'pointer',
            }}
          >
            <span className="truncate">{currentClinic.name}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 py-1 rounded-lg min-w-[200px] z-50 opacity-0 animate-fade-in-up"
              style={{
                background: CARD_BG,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                animationDuration: '0.2s',
                animationFillMode: 'forwards',
              }}
            >
              {clinics.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { switchClinic(c.id); setDropdownOpen(false); }}
                  className="w-full text-left py-2.5 px-4 text-sm transition-colors"
                  style={{
                    color: currentClinic.id === c.id ? GOLD : ZINC,
                    background: currentClinic.id === c.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {c.name}
                </button>
              ))}
              {!isStaff && (
                <div className="border-t border-white/10 mt-1 pt-1">
                  <button
                    type="button"
                    className="w-full text-left py-2.5 px-4 text-sm"
                    style={{ color: ZINC, opacity: 0.8, cursor: 'pointer', background: 'transparent' }}
                  >
                    ＋ 新增診所
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: 'rgba(212,175,55,0.2)', color: GOLD }}>
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm py-1.5 px-3 rounded-md"
            style={{ color: ZINC, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer' }}
          >
            登出
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
