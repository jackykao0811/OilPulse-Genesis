import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { resolveOrgId } from '../config/loadMasterConfig';

/** 診所 Domain Pack：Firestore 路徑 orgs/{org_id}/config/physician */
const CONFIG_COLLECTION = 'config';
const CONFIG_DOC_ID = 'physician';

/**
 * 遷移自原 client/src/App.tsx：醫師風格投餵與預約掛號（診所 Domain Pack）。
 */
const PhysicianConfigView: React.FC = () => {
  const [styleContent, setStyleContent] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [orgId, setOrgId] = useState(resolveOrgId('jacky_clinic'));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('org_id');
    const resolved = resolveOrgId(id || 'jacky_clinic');
    setOrgId(resolved);
  }, []);

  useEffect(() => {
    if (!orgId) return;
    const docRef = doc(db, 'orgs', orgId, CONFIG_COLLECTION, CONFIG_DOC_ID);
    getDoc(docRef).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStyleContent(d.styleContent ?? '');
        setBookingUrl(d.bookingUrl ?? '');
      }
    });
  }, [orgId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'orgs', orgId, CONFIG_COLLECTION, CONFIG_DOC_ID);
      await setDoc(
        docRef,
        {
          styleContent,
          bookingUrl,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      alert('✅ 儲存成功！');
    } catch {
      alert('❌ 儲存失敗');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 800,
        margin: '0 auto',
        fontFamily: "'Noto Serif TC', serif",
        backgroundColor: '#fcfbf9',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ letterSpacing: '2px' }}>OILPULSE GENESIS 2.6 · HeTu</h1>
      <div
        style={{
          backgroundColor: '#fff',
          padding: 30,
          borderRadius: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <h3>🩺 醫師風格投餵 [cite: 2026-02-12]</h3>
        <textarea
          value={styleContent}
          style={{
            width: '100%',
            height: 150,
            padding: 10,
            marginBottom: 20,
          }}
          onChange={(e) => setStyleContent(e.target.value)}
          placeholder="投餵您的專業見解..."
        />
        <label>🔗 預約掛號網址</label>
        <input
          value={bookingUrl}
          style={{
            width: '100%',
            padding: 10,
            marginTop: 5,
            marginBottom: 20,
          }}
          onChange={(e) => setBookingUrl(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: '100%',
            padding: 15,
            backgroundColor: isSaving ? '#ccc' : '#2c3e50',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          {isSaving ? '同步中...' : '儲存並啟動 AI 訓練'}
        </button>
      </div>
    </div>
  );
};

export default PhysicianConfigView;
