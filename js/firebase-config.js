// js/firebase-config.js
(function () {
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
  import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
  import { getAuth, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBrvRy59biZZilEgp8HIpHIUA16PcaflJU",
    authDomain: "perangkat-guru-85e8f.firebaseapp.com",
    projectId: "perangkat-guru-85e8f",
    storageBucket: "perangkat-guru-85e8f.firebasestorage.app",
    messagingSenderId: "489186826165",
    appId: "1:489186826165:web:c7b6d6a91ec70d12f06bfc",
    measurementId: "G-6K1DGGKEES"
  };

  const app = initializeApp(firebaseConfig);
  window.db = getFirestore(app);
  window.auth = getAuth(app);
  
  window.fs = { 
    collection, getDocs, setDoc, doc, deleteDoc, updateDoc,
    signInAnonymously, signOut 
  };
  
  window.dispatchEvent(new Event('firebase-ready'));
})();