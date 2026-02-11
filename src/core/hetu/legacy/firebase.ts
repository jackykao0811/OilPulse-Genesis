import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'oilpluse-cb370',
  authDomain: 'oilpluse-cb370.firebaseapp.com',
  storageBucket: 'oilpluse-cb370.appspot.com',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
