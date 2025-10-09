//ページ間にまたがる変数，関数をまとめる

let playerData;
//const maxYear = 100;
//const maxYear = 15;

//2025108 firebase対応
//20250922 ユーザー名対応
async function getUsers() {
//export async function getUsers() {
  const snapshot = await get(ref(window.db, "users"));

  if (snapshot.exists()) {
    const users = snapshot.val();
    // usernameだけの一覧を抽出
    return Object.keys(users); // → ["seven02"]
  } else {
    return []; // ユーザーがいない場合は空配列
  }
}
/*function getUsers() {
  //return JSON.parse(localStorage.getItem("users") || "[]");
}*/

//20251008 firebase対応
function saveUser(username, password) {
  const ref = window.ref(window.db, `users/${username}`);
  set(ref, { password })
    .then(() => {
      console.log("ユーザーを保存しました");
    })
    .catch(error => {
      console.error("保存エラー:", error);
    });
}
/*function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}*/

const gameConfig = {
  startAge: 80,
  endAge: 89,
  maxYears: 10, // endAge - startAge + 1
  startAffil: "エロい単語学者",
};

function loadPlayerData(id) {
  const raw = localStorage.getItem(`player_${id}`);
  return raw ? JSON.parse(raw) : null;
}

function savePlayerData(id, data) {
  localStorage.setItem(`player_${id}`, JSON.stringify(data));
}

// 1分 = 1年として扱う（ゲーム内時間）
function calculateGlobalYear() {
  const startDate = new Date("2025-09-05T00:00:00+09:00"); // ゲーム開始日
  const now = new Date();
  const diff = now - startDate;
  const globalYear = Math.floor(diff / (1000 * 60));
  return globalYear;
}

function calculateCycleNumber() {
  const year = calculateGlobalYear();
  return Math.floor(year / gameConfig.maxYears) + 1;
}

function get_yearInCycle(){
  const year = calculateGlobalYear();
  return (year % gameConfig.maxYears) + 1;
}
