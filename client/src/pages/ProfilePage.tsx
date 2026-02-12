import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';

const GOLD = '#D4AF37';
const ZINC = '#a1a1aa';
const BG = '#09090b';

export default function ProfilePage() {
  const { profile, setProfile, save } = useProfile();
  const [clinicName, setClinicName] = useState(profile.clinicName);
  const [bookingUrl, setBookingUrl] = useState(profile.bookingUrl);
  const [doctorSignature, setDoctorSignature] = useState(profile.doctorSignature);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setClinicName(profile.clinicName);
    setBookingUrl(profile.bookingUrl);
    setDoctorSignature(profile.doctorSignature);
  }, [profile.clinicName, profile.bookingUrl, profile.doctorSignature]);

  const handleSave = () => {
    setProfile({ clinicName, bookingUrl, doctorSignature });
    save();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="min-h-screen pt-12 pb-12 px-6"
      style={{ background: BG, color: ZINC, backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.08), transparent)' }}
    >
      <header className="max-w-2xl mx-auto flex justify-between items-center mb-10">
        <Link to="/" className="text-sm" style={{ color: ZINC, opacity: 0.8, textDecoration: 'none' }}>← 返回</Link>
        <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: '"Noto Serif TC", serif', color: GOLD }}>醫師設定檔</h1>
        <span style={{ width: 60 }} />
      </header>

      <main
        className="max-w-2xl mx-auto rounded-2xl p-6 opacity-0 animate-fade-in-up"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)', animationFillMode: 'forwards' }}
      >
        <p className="text-xs uppercase tracking-wider mb-6" style={{ color: GOLD }}>全域變數注射源頭</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-2" style={{ color: ZINC }}>診所名稱 (clinicName)</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="例：河圖中醫診所"
              className="w-full py-3 px-4 rounded-xl text-sm"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: GOLD }}>掛號連結 (bookingUrl) *</label>
            <input
              type="url"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://..."
              className="w-full py-3 px-4 rounded-xl text-sm"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(212,175,55,0.3)', color: '#fff', outline: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: ZINC }}>簽名檔 (doctorSignature)</label>
            <textarea
              value={doctorSignature}
              onChange={(e) => setDoctorSignature(e.target.value)}
              placeholder="醫師署名、職稱、診所資訊..."
              rows={4}
              className="w-full py-3 px-4 rounded-xl text-sm resize-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="mt-8 w-full py-3 rounded-xl font-medium text-sm tracking-wider"
          style={{
            background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(145deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))',
            border: `1px solid ${saved ? 'rgba(34,197,94,0.5)' : 'rgba(212,175,55,0.4)'}`,
            color: saved ? '#22c55e' : GOLD,
            cursor: 'pointer',
          }}
        >
          {saved ? '已儲存至 localStorage' : '儲存設定'}
        </button>
      </main>
    </div>
  );
}
