import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA5vY2-vkHh1ytLsHQSyLCVHipKcPp_qdQ",
    authDomain: "time-tracker-969b2.firebaseapp.com",
    projectId: "time-tracker-969b2",
    storageBucket: "time-tracker-969b2.appspot.com",
    messagingSenderId: "508591702780",
    appId: "1:508591702780:web:9f689a2470ba3408328d79"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app)