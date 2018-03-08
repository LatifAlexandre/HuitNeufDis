// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyALwGeXTcqkbvs86zsBb11ZAzsimsLdbHs",
    authDomain: "huitneufdis-1e9f6.firebaseapp.com",
    databaseURL: "https://huitneufdis-1e9f6.firebaseio.com",
    projectId: "huitneufdis-1e9f6",
    storageBucket: "huitneufdis-1e9f6.appspot.com",
    messagingSenderId: "941586994592"
    });
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();