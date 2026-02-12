import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorShield from './ErrorShield';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 全域 HeTu-ErrorShield：路徑、權限或數據異常時顯示專業診所風格引導頁，嚴禁白屏 [cite: 2026-02-08, 2026-02-12]
 */
export class HeTuErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('HeTuErrorBoundary', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorShield
          code="APP_ERROR"
          title="發生錯誤"
          message="系統暫時無法載入，請重新整理或返回首頁。若持續發生請聯絡技術支援。"
          onRetry={() => {
            this.setState({ hasError: false, error: null });
            window.location.href = '/';
          }}
        />
      );
    }
    return this.props.children;
  }
}
