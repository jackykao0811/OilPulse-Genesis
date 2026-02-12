import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

const apiKey = (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_API_KEY) || '';
const messagingSenderId = (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) || '';
const appId = (typeof process !== 'undefined' && process.env?.REACT_APP_FIREBASE_APP_ID) || '';

const firebaseConfig = {
  apiKey,
  projectId: 'oilpluse-cb370',
  authDomain: 'oilpluse-cb370.firebaseapp.com',
  storageBucket: 'oilpluse-cb370.appspot.com',
  messagingSenderId: messagingSenderId || undefined,
  appId: appId || undefined,
};

export let firebaseInitError: string | null = null;
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

try {
  if (!apiKey || apiKey.trim() === '') {
    firebaseInitError = 'REACT_APP_FIREBASE_API_KEY 未設定。請在專案根目錄建立 .env 並貼上 Firebase Console 的 API Key。';
  } else {
    _app = initializeApp(firebaseConfig);
    _db = getFirestore(_app);
    _auth = getAuth(_app);
  }
  if (!_app && !firebaseInitError) {
    firebaseInitError = 'Firebase 初始化失敗，請檢查 .env 設定是否與 Firebase Console 一致。';
  }
} catch (e) {
  firebaseInitError = e instanceof Error ? e.message : String(e);
}

export const app = _app;
export const db = _db;
export const auth = _auth;
