// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-c095c.firebaseapp.com",
  projectId: "blog-app-c095c",
  storageBucket: "blog-app-c095c.appspot.com",
  messagingSenderId: "966231954443",
  appId: "1:966231954443:web:606956540f540fcb4d230e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);