// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Replace with your project's credentials!
const firebaseConfig = {
  apiKey: "AIzaSyDeKpwnk_EOYBiu5Hzv4Kyd4UDEHQ6RUA4", 
  databaseURL: "http://127.0.0.1:9000?ns=relay-hackathon", 
  projectId: "relay-hackathon",
  // ... other properties
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database instance for use in components
export const database = getDatabase(app);