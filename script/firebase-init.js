//20251008 firabase初期化

// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4RoOn-ZMaMwuO8HPBinXotS4Vq661Y0I",
  authDomain: "jetg-game.firebaseapp.com",
  databaseURL: "https://jetg-game.firebaseio.com",
  projectId: "jetg-game",
  storageBucket: "jetg-game.firebasestorage.app",
  messagingSenderId: "150459389281",
  appId: "1:150459389281:web:65c7df3459334d538fe120"
};

// 初期化と同時に db を取得
const app = initializeApp(firebaseConfig);
window.db = getDatabase(app);
//export const db = getDatabase(app);
window.ref = ref;