import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../core/hetu/legacy/firebase';
import { useAuth } from '../../core/hetu/auth/AuthContext';

const GOLD = '#D4AF37';

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClinicIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClinicId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !auth?.currentUser) return;
    setError(null);
    setSubmitting(true);
    try {
      const uid = auth.currentUser.uid;
      await setDoc(doc(db, 'registrations', uid), {
        uid,
        clinicName: clinicName.trim(),
        clinicId: clinicId.trim().toLowerCase(),
        physicianName: physicianName.trim(),
        phone: phone.trim(),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#fafafa' }}>
        <div className="max-w-md w-full text-center rounded-2xl p-8 shadow-sm" style={{ background: '#fff', border: '1px solid #eee' }}>
          <p className="text-6xl mb-4">✓</p>
          <h1 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a', fontFamily: '"Noto Serif TC", serif' }}>
            申請已送出，請等待總部審核
          </h1>
          <p className="text-sm mb-6" style={{ color: '#666' }}>審核通過後將以 Email 通知您。</p>
          <button
            type="button"
            onClick={() => navigate('/status')}
            className="w-full py-3 rounded-xl font-medium text-sm"
            style={{ background: GOLD, color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            查看申請狀態
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#fafafa' }}>
      <div className="max-w-md w-full rounded-2xl p-8 shadow-sm" style={{ background: '#fff', border: '1px solid #eee' }}>
        <h1 className="text-xl font-semibold mb-1 text-center" style={{ color: '#1a1a1a', fontFamily: '"Noto Serif TC", serif' }}>
          醫師自助申請
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: '#666' }}>Genesis 2.8 · Phase 1</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#333' }}>診所名稱 (Clinic Name)</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              placeholder="例：河圖中醫診所"
              className="w-full py-3 px-4 rounded-xl border text-sm"
              style={{ borderColor: '#e5e5e5', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#333' }}>診所代碼 (Clinic ID)</label>
            <input
              type="text"
              value={clinicId}
              onChange={handleClinicIdChange}
              required
              placeholder="英文，自動轉小寫"
              className="w-full py-3 px-4 rounded-xl border text-sm lowercase"
              style={{ borderColor: '#e5e5e5', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#333' }}>醫師姓名 (Physician Name)</label>
            <input
              type="text"
              value={physicianName}
              onChange={(e) => setPhysicianName(e.target.value)}
              required
              placeholder="例：王小明"
              className="w-full py-3 px-4 rounded-xl border text-sm"
              style={{ borderColor: '#e5e5e5', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#333' }}>聯絡電話 (Phone)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="例：0912345678"
              className="w-full py-3 px-4 rounded-xl border text-sm"
              style={{ borderColor: '#e5e5e5', outline: 'none' }}
            />
          </div>
          {error && <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-medium text-sm disabled:opacity-60"
            style={{ background: GOLD, color: '#fff', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
          >
            {submitting ? '送出中…' : '送出申請'}
          </button>
        </form>
      </div>
    </div>
  );
}
