import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './core/hetu/auth/AuthContext';
import { HeTuErrorBoundary } from './core/hetu/components/HeTuErrorBoundary';
import { firebaseInitError } from './core/hetu/legacy/firebase';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const FirebaseErrorUI: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      fontFamily: "'Noto Serif TC', serif",
      padding: 24,
      maxWidth: 560,
      margin: '40px auto',
      background: '#f8f7f3',
      color: '#1A434E',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}
  >
    <h2 style={{ marginTop: 0 }}>Firebase 設定錯誤</h2>
    <p>{message}</p>
    <p style={{ fontSize: 14, color: '#666' }}>
      請在 <code>client/.env</code> 設定 <code>REACT_APP_FIREBASE_API_KEY</code> 等，並與 Firebase Console 專案設定一致。設定後請重新執行 <code>npm run build</code>。
    </p>
  </div>
);

root.render(
  <React.StrictMode>
    <HeTuErrorBoundary>
      {firebaseInitError ? (
        <FirebaseErrorUI message={firebaseInitError} />
      ) : (
        <AuthProvider>
          <App />
        </AuthProvider>
      )}
    </HeTuErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
