//20251008 firabase初期化

// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// 初期化と同時に db を取得
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
