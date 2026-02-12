import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../legacy/firebase';
import { useAuth } from '../auth/AuthContext';
import { resolveOrgId } from '../config/loadMasterConfig';
import ConversionStatsCards from '../components/ConversionStatsCards';
import CsvImport from '../components/CsvImport';
import BlockEditor from '../components/BlockEditor';
import { createEmptyMaster, type NewsletterMaster } from '../types/newsletter';
import { extractUrlsFromBlocks } from '../utils/linkWrapper';
import { buildNewsletterHtml } from '../utils/newsletterHtml';

const TRACKING_BASE = 'https://t.hetu-system.web.app';

/**
 * HeTu SaaS 醫療電子報全功能：名單導入、區塊創作、LinkWrapper、預覽頁尾、儀表板 [cite: 2026-02-08, 2026-02-12]
 */
const NewsletterEditorPage: React.FC = () => {
  const { orgId: authOrgId } = useAuth();
  const orgId = resolveOrgId(
    authOrgId ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('org_id') : null)
  );

  const [master, setMaster] = useState<NewsletterMaster>(createEmptyMaster());
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [footer, setFooter] = useState({ clinic_name: '', unsubscribe_base_url: '' });
  const [urlMapping, setUrlMapping] = useState<Record<string, string>>({});

  const getOrgConfig = httpsCallable<{ org_id: string }, { clinic_name: string; unsubscribe_base_url: string }>(
    getFunctions(app!),
    'getOrgConfig'
  );
  const setOrgConfig = httpsCallable<
    { org_id: string; clinic_name?: string; unsubscribe_base_url?: string },
    { ok: boolean }
  >(getFunctions(app!), 'setOrgConfig');
  const ensureTrackingLinks = httpsCallable<
    { org_id: string; campaign_id: string; urls: string[] },
    { mapping: Record<string, string> }
  >(getFunctions(app!), 'ensureTrackingLinks');
  const createCampaign = httpsCallable<
    { org_id: string; title: string; body: string; cta_url: string; cta_label: string },
    { campaign_id: string; tracking_id: string; tracking_url: string }
  >(getFunctions(app!), 'createNewsletterCampaign');

  useEffect(() => {
    getOrgConfig({ org_id: orgId })
      .then((res) => {
        const d = res.data;
        if (d) setFooter({ clinic_name: d.clinic_name ?? '', unsubscribe_base_url: d.unsubscribe_base_url ?? '' });
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const handleSaveConfig = () => {
    setOrgConfig({ org_id: orgId, clinic_name: footer.clinic_name, unsubscribe_base_url: footer.unsubscribe_base_url })
      .then(() => alert('診所設定已儲存'))
      .catch(() => alert('儲存失敗'));
  };

  const handleSaveCampaign = async () => {
    setSaving(true);
    try {
      const urls = extractUrlsFromBlocks(master.blocks);
      let cid = campaignId;
      if (!cid) {
        const title = master.blocks.find((b) => b.type === 'text') ? (master.blocks.find((b) => b.type === 'text') as { content: string }).content.slice(0, 50) : '未命名';
        const res = await createCampaign({
          org_id: orgId,
          title,
          body: '',
          cta_url: '',
          cta_label: '立即預約',
        });
        cid = (res.data as { campaign_id: string }).campaign_id;
        setCampaignId(cid);
      }
      if (urls.length > 0 && cid) {
        const res = await ensureTrackingLinks({ org_id: orgId, campaign_id: cid, urls });
        const data = res.data as { mapping?: Record<string, string> };
        if (data?.mapping) setUrlMapping((prev) => ({ ...prev, ...data.mapping }));
      }
    } catch (e) {
      alert('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  const previewHtml = buildNewsletterHtml(master, urlMapping, footer);

  return (
    <div
      style={{
        fontFamily: "'Noto Serif TC', serif",
        minHeight: '100vh',
        backgroundColor: '#f8f7f3',
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ color: '#1a434e', marginBottom: 24 }}>HeTu 醫療電子報</h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>轉換統計（發送總數、點擊人數、預計轉換）</h2>
          <ConversionStatsCards orgId={orgId} />
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>名單導入（CSV 拖拽，冪等）</h2>
          <CsvImport orgId={orgId} />
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>診所設定（頁尾嵌入）</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={footer.clinic_name}
              onChange={(e) => setFooter((f) => ({ ...f, clinic_name: e.target.value }))}
              placeholder="診所名稱"
              style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 8, minWidth: 200 }}
            />
            <input
              value={footer.unsubscribe_base_url}
              onChange={(e) => setFooter((f) => ({ ...f, unsubscribe_base_url: e.target.value }))}
              placeholder="退訂連結（含 org_id）"
              style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 8, minWidth: 280 }}
            />
            <button type="button" onClick={handleSaveConfig} style={{ padding: '10px 20px', background: '#1a434e', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              儲存
            </button>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>區塊創作（文字、圖片、診所預約按鈕；jacky_clinic 顯示易經運勢）</h2>
          <BlockEditor blocks={master.blocks} onChange={(blocks) => setMaster((m) => ({ ...m, blocks }))} orgId={orgId} />
          <button
            type="button"
            onClick={handleSaveCampaign}
            disabled={saving}
            style={{ marginTop: 16, padding: '12px 24px', background: saving ? '#94a3b8' : '#1a434e', color: '#fff', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? '儲存中…' : '儲存並產生追蹤連結（LinkWrapper）'}
          </button>
          {campaignId && (
            <p style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>
              追蹤基底：<a href={`${TRACKING_BASE}/t/${campaignId}`}>{TRACKING_BASE}/t/{campaignId}</a>
            </p>
          )}
        </section>

        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 14, color: '#64748b' }}>預覽（字型嵌入、頁尾診所名與退訂）</h2>
            <button type="button" onClick={() => setPreviewKey((k) => k + 1)} style={{ padding: '6px 12px', border: '1px solid #1a434e', borderRadius: 6, background: 'transparent', color: '#1a434e', fontSize: 12, cursor: 'pointer' }}>
              重新載入預覽
            </button>
          </div>
          <iframe
            key={previewKey}
            title="電子報預覽"
            srcDoc={previewHtml}
            style={{ width: '100%', height: 520, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
            sandbox="allow-same-origin"
          />
        </section>
      </div>
    </div>
  );
};

export default NewsletterEditorPage;
