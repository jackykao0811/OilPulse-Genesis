import React from 'react';
import { Link } from 'react-router-dom';
import { useClinic } from '../../context/ClinicContext';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const CARD_BG = '#18181b';

export default function ClinicDashboard() {
  const { currentClinic } = useClinic();
  const staffList = currentClinic.staff.length > 0 ? currentClinic.staff.join(', ') : '尚無';

  const handleInviteLink = () => {
    window.alert('邀請連結已複製到剪貼簿（模擬）');
  };

  return (
    <div key={currentClinic.id} className="max-w-3xl mx-auto py-10 px-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards', animationDuration: '0.35s' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div
          className="rounded-xl p-5 transition-all duration-300"
          style={{ background: CARD_BG, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: ZINC, opacity: 0.7 }}>訂閱人數</p>
          <p className="text-3xl font-semibold tabular-nums" style={{ color: GOLD }}>{currentClinic.audience}</p>
        </div>
        <div
          className="rounded-xl p-5 transition-all duration-300"
          style={{ background: CARD_BG, border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: ZINC, opacity: 0.7 }}>預約數</p>
          <p className="text-3xl font-semibold tabular-nums" style={{ color: GOLD }}>{currentClinic.visits}</p>
        </div>
      </div>

      <div className="mb-10">
        <Link
          to="/editor"
          className="block w-full py-5 rounded-xl text-center text-lg font-medium transition-all duration-200 hover:opacity-95"
          style={{
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8962f 100%)`,
            color: '#09090b',
            boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
            textDecoration: 'none',
          }}
        >
          撰寫電子報
        </Link>
      </div>

      <div
        className="rounded-xl p-6 transition-all duration-300"
        style={{ background: CARD_BG, border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-sm font-mono tracking-wider mb-3" style={{ color: GOLD }}>團隊協作 (Team)</h3>
        <p className="text-sm mb-4" style={{ color: ZINC }}>
          目前協作小編：{staffList}
        </p>
        <button
          type="button"
          onClick={handleInviteLink}
          className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: ZINC,
            cursor: 'pointer',
          }}
        >
          ＋ 邀請小編 (Generate Invite Link)
        </button>
      </div>
    </div>
  );
}
