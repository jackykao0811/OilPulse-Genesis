import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import ErrorShield from '../components/ErrorShield';

/**
 * 一鍵登入（Google / Line）[cite: 2026-02-08, 2026-02-12]
 * 登入後由 ensureOrgForUser 自動生成 org_id 並開闢數據空間。
 */
const LoginPage: React.FC = () => {
  const { user, orgId, loading, error, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Noto Serif TC', serif",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F7F3',
          color: '#1A434E',
        }}
      >
        <p>載入中...</p>
      </div>
    );
  }

  if (user && orgId) {
    return (
      <div
        style={{
          fontFamily: "'Noto Serif TC', serif",
          minHeight: '100vh',
          padding: 24,
          backgroundColor: '#F8F7F3',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <h1 style={{ color: '#1A434E', marginBottom: 16 }}>已登入</h1>
        <p style={{ color: '#64748B', marginBottom: 8 }}>帳號：{user.email ?? user.uid}</p>
        <p style={{ color: '#64748B', marginBottom: 24 }}>診所空間：{orgId}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/operator/newsletter?operator=1')}
            style={{
              padding: '12px 24px',
              background: '#1A434E',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: "'Noto Serif TC', serif",
            }}
          >
            進入電子報後台
          </button>
          <button
            type="button"
            onClick={() => signOut().then(() => navigate('/'))}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#1A434E',
              border: '1px solid #1A434E',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: "'Noto Serif TC', serif",
            }}
          >
            登出
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorShield
        code="AUTH_ERROR"
        title="登入異常"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Noto Serif TC', serif",
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F8F7F3',
        color: '#1A434E',
      }}
    >
      <h1 style={{ marginBottom: 8 }}>HeTu 醫療電子報</h1>
      <p style={{ fontSize: 14, color: '#64748B', marginBottom: 32 }}>一鍵登入，自動開通診所空間</p>
      <button
        type="button"
        onClick={signInWithGoogle}
        style={{
          padding: '14px 28px',
          background: '#1A434E',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: "'Noto Serif TC', serif",
          fontSize: 15,
        }}
      >
        使用 Google 登入
      </button>
      <button
        type="button"
        onClick={() => window.open('https://developers.line.biz/console/', '_blank')}
        style={{
          marginTop: 16,
          fontSize: 14,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: '#64748B',
        }}
      >
        Line 登入（需在 Firebase 與 Line Developer 設定 Channel 後啟用）
      </button>
    </div>
  );
};

export default LoginPage;
