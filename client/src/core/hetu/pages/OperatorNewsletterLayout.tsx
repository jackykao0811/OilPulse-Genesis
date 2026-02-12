import React from 'react';
import { Outlet } from 'react-router-dom';
import OperatorGuard from '../components/OperatorGuard';

/**
 * /operator 版面：OperatorGuard 包裹，符合 Genesis 2.6 協議 [cite: 2026-02-08]
 */
const OperatorNewsletterLayout: React.FC = () => (
  <OperatorGuard>
    <Outlet />
  </OperatorGuard>
);

export default OperatorNewsletterLayout;
