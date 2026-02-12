import React from 'react';
import { useAuth } from '../../core/hetu/auth/AuthContext';
import MainDashboardContent from '../MainDashboardContent';

const GOLD = '#D4AF37';

/**
 * Clinic OS 子系統入口：B2B 申請/登入後首頁，簡潔白/金風格，功能導向。
 */
export default function ClinicIndex() {
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="w-full max-w-4xl flex justify-between items-center mb-10">
        <p style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD, fontSize: 18 }}>
          歡迎，{user?.email ?? user?.displayName ?? '使用者'}
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="py-2 px-4 rounded-lg text-sm"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.5)',
            color: GOLD,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          登出
        </button>
      </header>
      <main className="max-w-4xl w-full text-center">
        <MainDashboardContent />
      </main>
    </>
  );
}
