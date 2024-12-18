// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn5SzwPNHdogEtaLX9Mh7aLthDsWMTFtg",
  authDomain: "ecohabits-398f3.firebaseapp.com",
  projectId: "ecohabits-398f3",
  storageBucket: "ecohabits-398f3.firebasestorage.app",
  messagingSenderId: "676649141219",
  appId: "1:676649141219:web:9037bc4163bdf973e856d6",
  measurementId: "G-LEJYW2HQJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app); 

export { database, db };
export default app;