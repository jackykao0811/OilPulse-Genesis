import React from 'react';
import type {
  NewsletterBlock,
  TextBlock,
  ImageBlock,
  BookingButtonBlock,
  YijingBlock,
} from '../types/newsletter';
import { createBlockId } from '../types/newsletter';

export interface BlockEditorProps {
  blocks: NewsletterBlock[];
  onChange: (blocks: NewsletterBlock[]) => void;
  orgId: string;
  /** Feature Gating: 僅 jacky_clinic 顯示易經區塊 [cite: 2026-02-08] */
  showYijingBlock?: boolean;
}

function BlockEditorInner({
  block,
  onUpdate,
  onRemove,
  showYijing,
}: {
  block: NewsletterBlock;
  onUpdate: (b: NewsletterBlock) => void;
  onRemove: () => void;
  showYijing: boolean;
}) {
  const common = {
    marginBottom: 12,
    padding: 12,
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontFamily: "'Noto Serif TC', serif",
  };

  if (block.type === 'text') {
    const b = block as TextBlock;
    return (
      <div style={common}>
        <label style={{ fontSize: 11, color: '#64748b' }}>文字</label>
        <textarea
          value={b.content}
          onChange={(e) => onUpdate({ ...b, content: e.target.value })}
          rows={4}
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <button type="button" onClick={onRemove} style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>移除</button>
      </div>
    );
  }
  if (block.type === 'image') {
    const b = block as ImageBlock;
    return (
      <div style={common}>
        <label style={{ fontSize: 11, color: '#64748b' }}>圖片</label>
        <input
          value={b.url}
          onChange={(e) => onUpdate({ ...b, url: e.target.value })}
          placeholder="圖片網址"
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <input
          value={b.alt ?? ''}
          onChange={(e) => onUpdate({ ...b, alt: e.target.value })}
          placeholder="替代文字"
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <button type="button" onClick={onRemove} style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>移除</button>
      </div>
    );
  }
  if (block.type === 'booking_button') {
    const b = block as BookingButtonBlock;
    return (
      <div style={common}>
        <label style={{ fontSize: 11, color: '#64748b' }}>診所預約按鈕</label>
        <input
          value={b.label}
          onChange={(e) => onUpdate({ ...b, label: e.target.value })}
          placeholder="按鈕文字"
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <input
          value={b.url}
          onChange={(e) => onUpdate({ ...b, url: e.target.value })}
          placeholder="預約頁網址"
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <button type="button" onClick={onRemove} style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>移除</button>
      </div>
    );
  }
  if (block.type === 'yijing' && showYijing) {
    const b = block as YijingBlock;
    return (
      <div style={common}>
        <label style={{ fontSize: 11, color: '#64748b' }}>易經算法運勢</label>
        <input
          value={b.title ?? ''}
          onChange={(e) => onUpdate({ ...b, title: e.target.value })}
          placeholder="標題"
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <textarea
          value={b.description ?? ''}
          onChange={(e) => onUpdate({ ...b, description: e.target.value })}
          placeholder="說明"
          rows={2}
          style={{ width: '100%', marginTop: 4, padding: 8 }}
        />
        <button type="button" onClick={onRemove} style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>移除</button>
      </div>
    );
  }
  return null;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  onChange,
  orgId,
  showYijingBlock = false,
}) => {
  const showYijing = orgId === 'jacky_clinic' || showYijingBlock;

  const addBlock = (type: NewsletterBlock['type']) => {
    const id = createBlockId();
    if (type === 'text') {
      onChange([...blocks, { id, type, content: '' }]);
    } else if (type === 'image') {
      onChange([...blocks, { id, type, url: '', alt: '' }]);
    } else if (type === 'booking_button') {
      onChange([...blocks, { id, type, label: '立即預約', url: '' }]);
    } else if (type === 'yijing' && showYijing) {
      onChange([...blocks, { id, type, title: '', description: '' }]);
    }
  };

  const updateBlock = (index: number, next: NewsletterBlock) => {
    const nextBlocks = [...blocks];
    nextBlocks[index] = next;
    onChange(nextBlocks);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  return (
    <div style={{ fontFamily: "'Noto Serif TC', serif" }}>
      {blocks.map((block, i) => (
        <BlockEditorInner
          key={block.id}
          block={block}
          onUpdate={(b) => updateBlock(i, b)}
          onRemove={() => removeBlock(i)}
          showYijing={showYijing}
        />
      ))}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        <button
          type="button"
          onClick={() => addBlock('text')}
          style={{ padding: '8px 16px', border: '1px solid #1A434E', borderRadius: 8, background: '#fff', color: '#1A434E', cursor: 'pointer', fontFamily: "'Noto Serif TC', serif" }}
        >
          ＋ 文字
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          style={{ padding: '8px 16px', border: '1px solid #1A434E', borderRadius: 8, background: '#fff', color: '#1A434E', cursor: 'pointer', fontFamily: "'Noto Serif TC', serif" }}
        >
          ＋ 圖片
        </button>
        <button
          type="button"
          onClick={() => addBlock('booking_button')}
          style={{ padding: '8px 16px', border: '1px solid #1A434E', borderRadius: 8, background: '#fff', color: '#1A434E', cursor: 'pointer', fontFamily: "'Noto Serif TC', serif" }}
        >
          ＋ 診所預約按鈕
        </button>
        {showYijing && (
          <button
            type="button"
            onClick={() => addBlock('yijing')}
            style={{ padding: '8px 16px', border: '1px solid #1A434E', borderRadius: 8, background: '#fff', color: '#1A434E', cursor: 'pointer', fontFamily: "'Noto Serif TC', serif" }}
          >
            ＋ 易經算法運勢
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
