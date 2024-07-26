// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDThbY9GOKkaVZ_HmwV72gs5Hof8UYY_GQ",
  authDomain: "armdatabase-755f9.firebaseapp.com",
  projectId: "armdatabase-755f9",
  storageBucket: "armdatabase-755f9.appspot.com",
  messagingSenderId: "250145775355",
  appId: "1:250145775355:web:baa7ea513df7a10300da5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)
