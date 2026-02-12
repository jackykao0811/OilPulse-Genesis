import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../core/hetu/legacy/firebase';
import { useAuth } from '../../core/hetu/auth/AuthContext';

const GOLD = '#D4AF37';

export default function StatusPage() {
  const { user, hasClinicId } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db || !auth?.currentUser) return;
    const uid = auth.currentUser.uid;
    getDoc(doc(db, 'registrations', uid))
      .then((snap) => {
        if (snap.exists()) setStatus((snap.data() as { status?: string }).status ?? 'PENDING');
        else setStatus(null);
      })
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#fafafa' }}>
        <p style={{ color: '#666' }}>載入中…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#fafafa' }}>
      <div className="max-w-md w-full text-center rounded-2xl p-8 shadow-sm" style={{ background: '#fff', border: '1px solid #eee' }}>
        <h1 className="text-xl font-semibold mb-6" style={{ color: '#1a1a1a', fontFamily: '"Noto Serif TC", serif' }}>申請狀態</h1>
        <p className="text-lg mb-2" style={{ color: GOLD }}>
          {status === 'PENDING' && '審核中 (PENDING)'}
          {status === 'APPROVED' && '已通過 (APPROVED)'}
          {status === 'REJECTED' && '未通過 (REJECTED)'}
          {!status && '尚無申請紀錄'}
        </p>
        <p className="text-sm mb-8" style={{ color: '#666' }}>
          {status === 'PENDING' && '總部審核通過後將通知您並開通 Clinic OS。'}
          {status === 'APPROVED' && '您可前往 Clinic OS 使用完整功能。'}
          {status === 'REJECTED' && '若有疑問請聯繫總部。'}
          {!status && '請先填寫醫師自助申請。'}
        </p>
        <div className="flex gap-3 justify-center">
          {!status && (
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="py-2.5 px-5 rounded-xl text-sm font-medium"
              style={{ background: GOLD, color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              前往申請
            </button>
          )}
          {hasClinicId && (
            <button
              type="button"
              onClick={() => navigate('/clinic')}
              className="py-2.5 px-5 rounded-xl text-sm font-medium"
              style={{ background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              進入 Clinic OS
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
