import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorShield from './ErrorShield';

export interface HeTuRootProps {
  children: React.ReactNode;
  errorTitle?: string;
  errorMessage?: string;
}

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
