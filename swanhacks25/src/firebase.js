// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// -----------------------------
// Minimal Firebase config
// -----------------------------
const firebaseConfig = {
    apiKey: "AIzaSyDeKpwnk_EOYBiu5Hzv4Kyd4UDEHQ6RUA4",
    projectId: "relay-hackathon",
    databaseURL: "http://127.0.0.1:9000?ns=relay-hackathon", // points to emulator
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Realtime Database
const database = getDatabase(app);
connectDatabaseEmulator(database, "127.0.0.1", 9000);

// Cloud Functions
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export { app, database, functions };
