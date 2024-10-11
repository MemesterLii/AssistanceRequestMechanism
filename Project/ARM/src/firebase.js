// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { } from 'firebase/app-check';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

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

// Create a ReCaptchaEnterpriseProvider instance using your reCAPTCHA Enterprise
// site key and pass it to initializeAppCheck().
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LfA0l4qAAAAANU8bnVkLFVPerkptLX1g6bYmz3v'),
  isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
});

export const database = getFirestore(app);
