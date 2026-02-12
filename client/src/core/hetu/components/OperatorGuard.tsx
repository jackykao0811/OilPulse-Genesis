import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorShield from './ErrorShield';

const OPERATOR_KEY = 'hetu_operator_guard';
const OPERATOR_QUERY = 'operator';

/**
 * Genesis 2.6 OperatorGuard 協議 [cite: 2026-02-08]
 * 僅在通過驗證時渲染子元件，否則導向首頁或顯示無權限。
 */
export interface OperatorGuardProps {
  children: React.ReactNode;
  /** 允許的 query 參數鍵名，預設 operator */
  queryKey?: string;
  /** 通過驗證時是否寫入 session，下次同 session 免再帶 query */
  persistInSession?: boolean;
}

const OperatorGuard: React.FC<OperatorGuardProps> = ({
  children,
  queryKey = OPERATOR_QUERY,
  persistInSession = true,
}) => {
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get(queryKey) === '1' || params.get(queryKey) === 'true';
    const fromSession = persistInSession && sessionStorage.getItem(OPERATOR_KEY) === '1';
    const ok = fromQuery || fromSession;
    if (fromQuery && persistInSession) {
      sessionStorage.setItem(OPERATOR_KEY, '1');
    }
    setAllowed(ok);
    setChecked(true);
  }, [location.search, queryKey, persistInSession]);

  if (!checked) return <div style={{ fontFamily: "'Noto Serif TC', serif", padding: 24, textAlign: 'center' }}>Hello HeTu</div>;
  if (!allowed) {
    return (
      <ErrorShield
        code="OPERATOR_REQUIRED"
        title="需要操作員權限"
        message="請使用授權連結進入（含 ?operator=1），或返回首頁。"
        onRetry={() => navigate('/', { replace: true })}
      />
    );
  }
  return <>{children}</>;
};

export default OperatorGuard;
