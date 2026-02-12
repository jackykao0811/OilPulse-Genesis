import React, { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../legacy/firebase';
import { resolveOrgId } from '../config/loadMasterConfig';

/**
 * 轉換率統計：O/C/K 與 發送總數、點擊人數、預計轉換人數 [cite: 2026-02-08]
 */
export interface ConversionStats {
  O: number;
  C: number;
  K: number;
  open_rate?: number;
  click_rate?: number;
  conversion_rate?: number;
  sent_total?: number;
  click_count?: number;
  estimated_conversions?: number;
}

const getConversionStats = httpsCallable<
  { org_id: string; campaign_id?: string },
  ConversionStats
>(getFunctions(app!), 'getConversionStats');
const getConversionReport = httpsCallable<
  { org_id: string },
  { sent_total: number; click_count: number; estimated_conversions: number }
>(getFunctions(app!), 'getConversionReport');

export interface ConversionStatsCardsProps {
  orgId?: string | null;
  campaignId?: string | null;
}

const ConversionStatsCards: React.FC<ConversionStatsCardsProps> = ({
  orgId,
  campaignId,
}) => {
  const resolvedOrg = resolveOrgId(orgId);
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getConversionStats({ org_id: resolvedOrg, ...(campaignId && { campaign_id: campaignId }) }),
      getConversionReport({ org_id: resolvedOrg }),
    ])
      .then(([statsRes, reportRes]) => {
        if (cancelled) return;
        const s = statsRes.data as ConversionStats;
        const r = reportRes.data as { sent_total: number; click_count: number; estimated_conversions: number };
        setStats({
          ...s,
          sent_total: r?.sent_total ?? s?.sent_total,
          click_count: r?.click_count ?? s?.C,
          estimated_conversions: r?.estimated_conversions ?? s?.C,
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedOrg, campaignId]);

  if (loading) {
    return (
      <div style={{ padding: 16, color: '#64748b', fontFamily: "'Noto Serif TC', serif" }}>
        載入統計中...
      </div>
    );
  }
  if (!stats) return null;

  const cards = [
    { label: '發送總數', value: stats.sent_total ?? 0, sub: 'newsletter_campaigns' },
    { label: '點擊人數', value: stats.click_count ?? stats.C ?? 0, sub: 'C（點擊）' },
    { label: '預計轉換人數', value: stats.estimated_conversions ?? stats.C ?? 0, sub: 'estimated_conversions' },
    { label: 'O（開啟）', value: stats.O ?? 0, sub: `開啟率 ${stats.open_rate ?? 0}%` },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        fontFamily: "'Noto Serif TC', serif",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            padding: 20,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            {card.label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#1a434e' }}>
            {card.value}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
            {card.sub}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversionStatsCards;
