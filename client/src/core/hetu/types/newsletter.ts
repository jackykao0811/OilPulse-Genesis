/**
 * Newsletter_Master：區塊化內容的單一 JSON 物件 [cite: 2026-02-08, 2026-02-12]
 */
export type BlockType = 'text' | 'image' | 'booking_button' | 'yijing';

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BlockBase {
  type: 'text';
  content: string;
}

export interface ImageBlock extends BlockBase {
  type: 'image';
  url: string;
  alt?: string;
}

export interface BookingButtonBlock extends BlockBase {
  type: 'booking_button';
  label: string;
  url: string;
}

export interface YijingBlock extends BlockBase {
  type: 'yijing';
  title?: string;
  description?: string;
}

export type NewsletterBlock =
  | TextBlock
  | ImageBlock
  | BookingButtonBlock
  | YijingBlock;

export interface NewsletterMaster {
  version: number;
  blocks: NewsletterBlock[];
  updated_at?: string;
}

export function createBlockId(): string {
  return 'b_' + Math.random().toString(36).slice(2, 11);
}

export function createEmptyMaster(): NewsletterMaster {
  return { version: 1, blocks: [] };
}
