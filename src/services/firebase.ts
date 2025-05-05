// firebase.js
import { initializeApp } from "firebase/app";
import { firebaseConf } from "../services/credentials"; // Import Firebase config
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// Initialize Firebase
export const app = initializeApp(firebaseConf);
// initialize Firebase DB
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const dbRt = getDatabase(app);
export const analytics = getAnalytics(app);
