import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';
const STORAGE_KEY = 'HETU_AUDIENCE';

export interface Subscriber {
  name: string;
  email: string;
  tags: string;
  lastVisit: string;
}

function loadAudience(): Subscriber[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveAudience(list: Subscriber[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function toCSV(list: Subscriber[]): string {
  return Papa.unparse(list, { columns: ['name', 'email', 'tags', 'lastVisit'] });
}

export default function AudiencePage() {
  const [list, setList] = useState<Subscriber[]>(loadAudience);
  const [preview, setPreview] = useState<Subscriber[] | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = (res.data || []).map((r) => ({
          name: r.name ?? r.Name ?? r.姓名 ?? '',
          email: r.email ?? r.Email ?? r.信箱 ?? '',
          tags: r.tags ?? r.Tags ?? r.標籤 ?? '',
          lastVisit: r.lastVisit ?? r['Last Visit'] ?? r.最後就診 ?? '',
        }));
        setPreview(rows);
      },
    });
  }, []);

  const confirmImport = () => {
    if (preview?.length) {
      setList((prev) => {
        const next = [...prev, ...preview];
        saveAudience(next);
        return next;
      });
      setPreview(null);
      setFileInputKey((k) => k + 1);
    }
  };

  const handleExport = () => {
    const csv = toCSV(list);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `audience-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="min-h-screen pt-12 pb-12 px-6" style={{ background: BG, color: ZINC, backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.08), transparent)' }}>
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <Link to="/" className="text-sm" style={{ color: ZINC, opacity: 0.8, textDecoration: 'none' }}>← 返回</Link>
        <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}>名單金庫</h1>
        <span style={{ width: 60 }} />
      </header>

      <div className="max-w-4xl mx-auto space-y-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
        {/* Import */}
        <section className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <h2 className="text-sm font-mono tracking-wider mb-4" style={{ color: GOLD }}>導入 CSV</h2>
          <input key={fileInputKey} type="file" accept=".csv" onChange={handleFile} className="block w-full text-sm" style={{ color: ZINC }} />
          {preview && preview.length > 0 && (
            <>
              <p className="mt-4 text-sm mb-2" style={{ color: ZINC }}>預覽 ({preview.length} 筆)</p>
              <div className="overflow-x-auto rounded-lg mb-4" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th className="text-left py-2 px-3" style={{ color: GOLD }}>Name</th>
                      <th className="text-left py-2 px-3" style={{ color: GOLD }}>Email</th>
                      <th className="text-left py-2 px-3" style={{ color: GOLD }}>Tags</th>
                      <th className="text-left py-2 px-3" style={{ color: GOLD }}>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td className="py-2 px-3">{r.name}</td>
                        <td className="py-2 px-3">{r.email}</td>
                        <td className="py-2 px-3">{r.tags}</td>
                        <td className="py-2 px-3">{r.lastVisit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={confirmImport} className="py-2 px-4 rounded-lg text-sm" style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: GOLD, cursor: 'pointer' }}>確認匯入</button>
            </>
          )}
        </section>

        {/* Export */}
        <section className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-3 py-3 px-5 rounded-xl font-medium text-sm"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', cursor: 'pointer' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            完整數據打包 (Export Data)
          </button>
        </section>

        {/* List */}
        <section className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <h2 className="text-sm font-mono tracking-wider mb-4" style={{ color: GOLD }}>病患名單 ({list.length})</h2>
          <div className="overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th className="text-left py-2 px-3" style={{ color: GOLD }}>Name</th>
                  <th className="text-left py-2 px-3" style={{ color: GOLD }}>Email</th>
                  <th className="text-left py-2 px-3" style={{ color: GOLD }}>Tags</th>
                  <th className="text-left py-2 px-3" style={{ color: GOLD }}>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center" style={{ color: ZINC, opacity: 0.6 }}>尚無資料，請先匯入 CSV</td></tr>
                ) : (
                  list.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td className="py-2 px-3">{r.name}</td>
                      <td className="py-2 px-3">{r.email}</td>
                      <td className="py-2 px-3">{r.tags}</td>
                      <td className="py-2 px-3">{r.lastVisit}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
