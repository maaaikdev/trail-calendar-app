// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore" //Obtiene la base de datos

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUW9LSMpsP9lIzpM5PqAVMdsvnZ4kUC8o",
  authDomain: "mdb-calendar-app.firebaseapp.com",
  projectId: "mdb-calendar-app",
  storageBucket: "mdb-calendar-app.appspot.com",
  messagingSenderId: "511285202918",
  appId: "1:511285202918:web:dda8c78597d13e796f1027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)