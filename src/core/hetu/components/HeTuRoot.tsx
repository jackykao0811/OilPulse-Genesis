import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorShield from './ErrorShield';

export interface HeTuRootProps {
  children: React.ReactNode;
  /** 路由失效時顯示的標題 */
  errorTitle?: string;
  /** 路由失效時顯示的說明 */
  errorMessage?: string;
}

/**
 * HeTu 包裹層：在路由失效時自動降級至 ErrorShield，而非 Firebase 預設 404。
 * 所有未匹配路徑皆導向 ErrorShield，確保 SPA 由 HeTu 掌控錯誤呈現。
 */
const HeTuRoot: React.FC<HeTuRootProps> = ({
  children,
  errorTitle,
  errorMessage,
}) => {
  const handleRetry = () => {
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        {children}
        <Route
          path="*"
          element={
            <ErrorShield
              code="ROUTE_MISSING"
              title={errorTitle ?? '頁面無法載入'}
              message={
                errorMessage ??
                '您所請求的路徑不存在或暫時無法使用，請返回首頁或重新整理。'
              }
              onRetry={handleRetry}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default HeTuRoot;
