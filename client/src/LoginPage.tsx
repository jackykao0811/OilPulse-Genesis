import React, { useState } from 'react';
import { useAuth } from './core/hetu/auth/AuthContext';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';
const RED = '#ef4444';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: BG,
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212, 175, 55, 0.12), transparent)',
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: '0 0 40px rgba(212, 175, 55, 0.08)',
        }}
      >
        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}
        >
          河圖科技 | 安全登入
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: ZINC, opacity: 0.9 }}>
          雙通道驗證
        </p>

        {/* 通道一：Google */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-medium text-sm tracking-wider mb-6"
          style={{
            background: 'linear-gradient(145deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: GOLD,
            fontFamily: 'system-ui, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          使用 Google 帳號登入 (推薦)
        </button>

        <div className="flex items-center gap-3 mb-6" style={{ color: ZINC, opacity: 0.6 }}>
          <span className="flex-1 border-t" style={{ borderColor: 'currentColor' }} />
          <span className="text-xs">或</span>
          <span className="flex-1 border-t" style={{ borderColor: 'currentColor' }} />
        </div>

        {/* 通道二：Email */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 px-4 rounded-xl text-sm"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              outline: 'none',
            }}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 rounded-xl text-sm"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              outline: 'none',
            }}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
          {error && (
            <p className="text-sm" style={{ color: RED }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full py-3 px-4 rounded-xl font-medium text-sm"
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.5)',
              color: GOLD,
              cursor: loading || !email.trim() || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !email.trim() || !password ? 0.6 : 1,
            }}
          >
            {isSignUp ? '註冊' : '登入'}
          </button>
        </form>

        {/* 切換登入 / 註冊 */}
        <p className="text-center mt-6 text-sm" style={{ color: ZINC, opacity: 0.8 }}>
          {isSignUp ? '已有帳號？' : '還沒有帳號？'}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 underline"
            style={{ color: GOLD, cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontSize: 'inherit' }}
          >
            {isSignUp ? '立即登入' : '註冊新帳號'}
          </button>
        </p>
      </div>
    </div>
  );
}
