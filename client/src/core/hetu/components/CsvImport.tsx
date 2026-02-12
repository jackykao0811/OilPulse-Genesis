import React, { useCallback, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../legacy/firebase';

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface CsvImportProps {
  orgId: string;
  onSuccess?: (result: { imported: number; skipped: number }) => void;
  onError?: (message: string) => void;
}

/**
 * CSV 導入：拖拽上傳、檔案 Hash 冪等。同一份名單重複上傳僅處理增量 [cite: 2026-02-08, 2026-02-12]
 * 邊緣處理：空檔案、斷網重連、無效 CSV
 */
const CsvImport: React.FC<CsvImportProps> = ({ orgId, onSuccess, onError }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastResult, setLastResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [offline, setOffline] = useState(false);

  const doImport = useCallback(
    async (csvText: string) => {
      if (!csvText || !csvText.trim()) {
        onError?.('檔案為空或無內容');
        return;
      }
      setUploading(true);
      setOffline(false);
      try {
        const fileHash = await sha256Hex(csvText);
        const importSubscribers = httpsCallable<
          { org_id: string; csv_text: string; file_hash: string },
          { imported: number; skipped: number; message?: string }
        >(getFunctions(app!), 'importSubscribers');
        const res = await importSubscribers({
          org_id: orgId,
          csv_text: csvText,
          file_hash: fileHash,
        });
        const data = res.data;
        if (data && typeof data.imported === 'number') {
          setLastResult({ imported: data.imported, skipped: data.skipped ?? 0 });
          onSuccess?.({ imported: data.imported, skipped: data.skipped ?? 0 });
        } else {
          onError?.((data as { message?: string })?.message ?? '導入失敗');
        }
      } catch (e: unknown) {
        const err = e as { code?: string; message?: string };
        if (err?.code === 'unavailable' || err?.message?.toLowerCase().includes('network')) {
          setOffline(true);
          onError?.('網路中斷，請檢查連線後重試');
        } else {
          onError?.(err?.message ?? '導入失敗');
        }
      } finally {
        setUploading(false);
      }
    },
    [orgId, onSuccess, onError]
  );

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      if (file.size === 0) {
        onError?.('檔案為空，請選擇有內容的 CSV');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === 'string' ? reader.result : '';
        doImport(text);
      };
      reader.onerror = () => onError?.('無法讀取檔案');
      reader.readAsText(file, 'UTF-8');
    },
    [doImport, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.csv') && !file.type.includes('csv') && !file.type.includes('text')) {
        onError?.('請上傳 CSV 或文字檔');
        return;
      }
      handleFile(file);
    },
    [handleFile, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
      e.target.value = '';
    },
    [handleFile]
  );

  return (
    <div style={{ fontFamily: "'Noto Serif TC', serif" }}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${dragging ? '#1A434E' : '#cbd5e1'}`,
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          backgroundColor: dragging ? '#f0f9ff' : '#f8fafc',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.7 : 1,
        }}
      >
        <input
          type="file"
          accept=".csv,text/csv,text/plain"
          onChange={handleInputChange}
          disabled={uploading}
          style={{ display: 'none' }}
          id="csv-import-input"
        />
        <label htmlFor="csv-import-input" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
          {uploading ? (
            <span style={{ color: '#64748b' }}>上傳中…（冪等：同檔案僅處理增量）</span>
          ) : (
            <span style={{ color: '#1A434E' }}>
              {dragging ? '放開以上傳' : '拖拽 CSV 至此，或點擊選擇檔案'}
            </span>
          )}
        </label>
      </div>
      {offline && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#b91c1c' }}>
          目前離線，請檢查網路後再試一次。
        </p>
      )}
      {lastResult !== null && (
        <p style={{ marginTop: 12, fontSize: 13, color: '#64748b' }}>
          本次匯入 {lastResult.imported} 筆，略過重複 {lastResult.skipped} 筆
        </p>
      )}
    </div>
  );
};

export default CsvImport;
