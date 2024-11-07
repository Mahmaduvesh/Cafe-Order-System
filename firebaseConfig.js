import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDliBusw4QwZdy3sXPGmyqgQRnALWRFRcI",
  authDomain: "login-c7ccf.firebaseapp.com",
  databaseURL: "https://login-c7ccf-default-rtdb.firebaseio.com/",
  projectId: "login-c7ccf",
  storageBucket: "login-c7ccf.appspot.com",
  messagingSenderId: "425239365450",
  appId: "1:425239365450:web:a4c4b3cb2dfaa97dc0a3b3",
  measurementId: "G-VERQ7WYXR0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
