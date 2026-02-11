import React from 'react';

export interface ErrorShieldProps {
  title?: string;
  message?: string;
  code?: string;
  onRetry?: () => void;
}

/**
 * 路由失效或錯誤時降級顯示，取代 Firebase 預設 404 頁面。
 */
const ErrorShield: React.FC<ErrorShieldProps> = ({
  title = '頁面無法載入',
  message = '您所請求的路徑不存在或暫時無法使用，請返回首頁或重新整理。',
  code = 'ROUTE_MISSING',
  onRetry,
}) => (
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
      color: '#1A202C',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        maxWidth: 420,
        padding: '2rem',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(26, 67, 78, 0.06)',
        background: '#FFF',
      }}
    >
      <p
        style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          color: '#64748B',
          marginBottom: 8,
        }}
      >
        HeTu ErrorShield · {code}
      </p>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#1A434E',
          marginBottom: 12,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: '#64748B',
          marginBottom: 24,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            padding: '10px 20px',
            border: '1px solid #1A434E',
            borderRadius: 9999,
            background: 'transparent',
            color: '#1A434E',
            fontFamily: "'Noto Serif TC', serif",
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          重新載入
        </button>
      )}
    </div>
  </div>
);

export default ErrorShield;
