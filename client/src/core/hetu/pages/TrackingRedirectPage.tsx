import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../legacy/firebase';
import ErrorShield from '../components/ErrorShield';

/**
 * 全域追蹤路由 /t/:tracking_id
 * 提取 tracking_id → 記錄至 Conversion_Logs（冪等）→ 302 重定向至目標網址 [cite: 2026-02-08]
 */
const TrackingRedirectPage: React.FC = () => {
  const { tracking_id } = useParams<{ tracking_id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tracking_id) {
      setError('MISSING_TRACKING_ID');
      return;
    }

    const run = async () => {
      try {
        const functions = getFunctions(app!);
        const record = httpsCallable<
          { tracking_id: string; type?: string },
          { target_url: string; already_logged?: boolean }
        >(functions, 'recordConversionAndGetTarget');
        const res = await record({
          tracking_id,
          type: 'click',
        });
        const data = res.data;
        if (data?.target_url) {
          window.location.replace(data.target_url);
          return;
        }
      } catch (e) {
        setError('TRACKING_NOT_FOUND');
        return;
      }
    };

    run();
  }, [tracking_id]);

  if (error) {
    return (
      <ErrorShield
        code={error}
        title="追蹤連結無效"
        message="此連結已過期或不存在，請返回首頁。"
        onRetry={() => navigate('/', { replace: true })}
      />
    );
  }

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
      <p style={{ fontSize: 14 }}>正在導向...</p>
    </div>
  );
};

export default TrackingRedirectPage;
