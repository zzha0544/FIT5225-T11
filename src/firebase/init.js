// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5eQy6-gA6-LIAEQmxIEHY8oGHeP-u9bQ",
    authDomain: "week7-zihan-zhang.firebaseapp.com",
    projectId: "week7-zihan-zhang",
    storageBucket: "week7-zihan-zhang.firebasestorage.app",
    messagingSenderId: "422324918316",
    appId: "1:422324918316:web:f658b559f1f918ad30d989"
};
// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();
export { db };