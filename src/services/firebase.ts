// firebase.js
import { initializeApp } from 'firebase/app';
import { firebaseConf } from '../services/credentials'; // Import Firebase config

// Initialize Firebase
export  const app = initializeApp(firebaseConf);