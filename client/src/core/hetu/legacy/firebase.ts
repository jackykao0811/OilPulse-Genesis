import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCad1QLDSCqstjtgGCjsOFg8T5e25TF3as',
  authDomain: 'oilpluse-cb370.firebaseapp.com',
  projectId: 'oilpluse-cb370',
  storageBucket: 'oilpluse-cb370.firebasestorage.app',
  messagingSenderId: '528786863961',
  appId: '1:528786863961:web:c465b0f5c9417129dd3e48',
  measurementId: 'G-7FXKYM0PWQ',
};

export let firebaseInitError: string | null = null;
let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

try {
  _app = initializeApp(firebaseConfig);
  _db = getFirestore(_app);
  _auth = getAuth(_app);
} catch (e) {
  firebaseInitError = e instanceof Error ? e.message : String(e);
}

export const app = _app;
export const db = _db;
export const auth = _auth;
