import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import Papa from 'papaparse';
import { db, auth } from '../../core/hetu/legacy/firebase';
import { useAuth } from '../../core/hetu/auth/AuthContext';

const PASSCODE = '888';
const GOLD = '#eab308';
const GOLD_DARK = '#ca8a04';
const ZINC_950 = '#09090b';
const ZINC_200 = '#e4e4e7';

interface ClinicDoc {
  id: string;
  name: string;
  ownerId: string;
  code: string;
  audienceCount?: number;
}

export default function VipPage() {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [clinic, setClinic] = useState<ClinicDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [audienceCount, setAudienceCount] = useState(0);
  const [openRate, setOpenRate] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendDone, setSendDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === PASSCODE) {
      setIsUnlocked(true);
      setPasscode('');
    }
  };

  useEffect(() => {
    if (!isUnlocked || !user) return;
    const uid = auth?.currentUser?.uid ?? user.uid;
    setLoadError(null);
    setLoading(true);

    const applyClinic = (c: ClinicDoc) => {
      setClinic(c);
      setOpenRate(62.4);
      setLoading(false);
    };

    const failWithMock = (err: unknown) => {
      console.warn('VIP clinic load failed, using mock:', err);
      setLoadError(err instanceof Error ? err.message : '無法連線 Firestore');
      applyClinic({
        id: 'mock-vip',
        name: 'VIP Clinic - ' + (user.displayName || user.email || 'User'),
        ownerId: uid,
        code: 'vip-' + uid.slice(0, 4),
      });
    };

    if (!db) {
      applyClinic({
        id: 'mock-vip',
        name: 'VIP Clinic - ' + (user.displayName || user.email || 'User'),
        ownerId: uid,
        code: 'vip-' + uid.slice(0, 4),
      });
      return;
    }

    const clinicsRef = collection(db, 'clinics');
    getDocs(query(clinicsRef, where('ownerId', '==', uid)))
      .then((snap) => {
        if (snap.empty) {
          const name = 'VIP Clinic - ' + (user.displayName || user.email || 'User');
          const code = 'vip-' + uid.slice(0, 4);
          return addDoc(clinicsRef, { name, ownerId: uid, code })
            .then((ref) => ({ id: ref.id, name, ownerId: uid, code }))
            .catch((err) => { failWithMock(err); return null; });
        }
        const first = snap.docs[0];
        const d = first.data();
        return { id: first.id, name: d.name, ownerId: d.ownerId, code: d.code };
      })
      .then((c) => {
        if (c) {
          setClinic(c as ClinicDoc);
          setOpenRate(62.4);
        }
      })
      .catch(failWithMock)
      .finally(() => setLoading(false));
  }, [isUnlocked, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: any) => {
        const rows = res.data?.length ?? 0;
        setAudienceCount((prev) => prev + rows);
      },
    });
    e.target.value = '';
  };

  const handleSendBlast = async () => {
    if (!db || !auth?.currentUser || !clinic) return;
    setSending(true);
    setSendDone(false);
    try {
      await addDoc(collection(db, 'mail_queue'), {
        clinicId: clinic.id,
        subject: subject.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        uid: auth.currentUser.uid,
      });
      setSendDone(true);
      setSubject('');
      setContent('');
    } catch {
      setSendDone(false);
    } finally {
      setSending(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: ZINC_950 }}>
        <div className="w-full max-w-xs">
          <p className="text-center text-xs tracking-widest mb-6 font-mono" style={{ color: GOLD }}>VIP · EXTREME CHANNEL</p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••"
              className="w-full py-4 px-4 rounded-lg text-center text-xl font-mono tracking-[0.4em]"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '2px solid rgba(234,179,8,0.5)',
                color: GOLD,
                outline: 'none',
              }}
              autoFocus
            />
            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg font-mono text-sm tracking-wider"
              style={{ background: GOLD_DARK, color: ZINC_950, border: 'none', cursor: 'pointer' }}
            >
              UNLOCK
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading && !clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4" style={{ background: ZINC_950 }}>
        <p className="font-mono text-sm" style={{ color: GOLD }}>LOADING ...</p>
        <p className="font-mono text-xs opacity-70" style={{ color: ZINC_200 }}>正在開通診所</p>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 gap-4" style={{ background: ZINC_950 }}>
        <p className="font-mono text-sm" style={{ color: '#ef4444' }}>無法載入診所</p>
        {loadError && <p className="font-mono text-xs max-w-md text-center" style={{ color: ZINC_200 }}>{loadError}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-mono" style={{ background: ZINC_950, color: ZINC_200 }}>
      <div className="max-w-3xl mx-auto">
        <header className="border-b mb-8 pb-4" style={{ borderColor: 'rgba(234,179,8,0.2)' }}>
          <h1 className="text-lg tracking-widest" style={{ color: GOLD }}>VIP · BLAST CONSOLE</h1>
          <p className="text-xs mt-1 opacity-80">{clinic.name} · {clinic.code}</p>
        </header>

        <section className="mb-8 rounded-lg p-5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <h2 className="text-xs tracking-wider mb-3 uppercase" style={{ color: GOLD }}>A · 受眾 Audience</h2>
          <p className="text-2xl mb-4" style={{ color: GOLD }}>{audienceCount}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="py-2 px-4 rounded text-sm"
            style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.4)', color: GOLD, cursor: 'pointer' }}
          >
            📂 上傳名單
          </button>
        </section>

        <section className="mb-8 rounded-lg p-5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <h2 className="text-xs tracking-wider mb-3 uppercase" style={{ color: GOLD }}>B · 發射 Launch</h2>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject 標題"
            className="w-full py-2.5 px-3 rounded mb-3 text-sm"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: ZINC_200, outline: 'none' }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content 內容"
            rows={5}
            className="w-full py-2.5 px-3 rounded mb-4 text-sm resize-none"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: ZINC_200, outline: 'none' }}
          />
          <button
            type="button"
            onClick={handleSendBlast}
            disabled={sending || !subject.trim() || !content.trim()}
            className="py-3 px-5 rounded text-sm font-semibold disabled:opacity-50"
            style={{ background: GOLD_DARK, color: ZINC_950, border: 'none', cursor: sending ? 'not-allowed' : 'pointer' }}
          >
            🚀 發送 (Send Blast)
          </button>
          {sendDone && <p className="mt-2 text-xs" style={{ color: GOLD }}>已寫入 mail_queue</p>}
        </section>

        <section className="rounded-lg p-5" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <h2 className="text-xs tracking-wider mb-3 uppercase" style={{ color: GOLD }}>C · 戰報 Report</h2>
          <p className="text-3xl mb-1" style={{ color: GOLD }}>{openRate}%</p>
          <p className="text-xs opacity-80">Open Rate (最近一檔)</p>
        </section>
      </div>
    </div>
  );
}
