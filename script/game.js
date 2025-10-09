function updateCycleTimeDisplay() {
  const year = calculateGlobalYear();
  const cycle = calculateCycleNumber();
  const yearInCycle = (year % gameConfig.maxYears) + 1

  document.getElementById("current-cycle-time").textContent =
    `第${cycle}回 ${yearInCycle}年目`;
}

function updateStatusPanel(playerData) {
  document.getElementById("player-name").textContent = `名前：${playerData.name}`;
  const list = document.getElementById("status-list");

  const ageDisplay = `<li><strong>${playerData.age}歳</strong></li>`;
  //const ageDisplay = `<li><strong>${playerData.localYear}歳</strong></li>`;

  console.log("playerData.stats:", playerData.stats);
  const statItems = Object.entries(playerData.stats)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("");
  
  const affiliation = playerData.affiliation;
  //const affiliation = playerData.affiliations;
  const affilDisplay = `<li>所属：${affiliation}`;

  list.innerHTML = ageDisplay + statItems + affilDisplay;
}

function calcPointIncrease(prevStats, newStats) {
  const erosDiff = Math.max(0, (newStats.eros || 0) - (prevStats.eros || 0));
  const moneyDiff = Math.max(0, (newStats.money || 0) - (prevStats.money || 0));
  return erosDiff + moneyDiff;
}

function applyOption(option, stats) {
  let successRate = option.baseRate || 0;
  if (option.rateBoost) {
    for (let stat in option.rateBoost) {
      successRate += (stats[stat] || 0) * option.rateBoost[stat];
    }
  }
  successRate = Math.min(successRate, 100);
  const roll = Math.random() * 100;
  const isSuccess = roll < successRate;
  const effects = isSuccess ? option.successEffects : option.failureEffects;
  const resultText = option.resultText ? (isSuccess ? option.resultText.success : option.resultText.failure) : "";

  // 変更前の値を保存
  const prevStats = { eros: stats.eros || 0, money: stats.money || 0 };

  for (let stat in effects) {
    if(stat != "affiliation")
      stats[stat] = (stats[stat] || 0) + effects[stat];
  }

  if (effects.affiliation){
    playerData.affiliation = effects.affiliation;
    //playerData.affiliations = effects.affiliation;
  }

  // ポイント加算
  const addPoint = calcPointIncrease(prevStats, stats);
  stats.points = (stats.points || 0) + addPoint;

  return {
    message: `「${option.text}」 → ${isSuccess ? "成功！" : "失敗…"}`,
    effects,
    text: resultText
  };
}

function displayEvent(event, playerData, onComplete) {
  document.getElementById("event-title").textContent = event.title;
  document.getElementById("event-description").textContent = event.description || "";
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  document.getElementById("result-log").innerHTML = "";

  let optionSelected = false;

  event.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = async () => {
      if (optionSelected) return; // ← すでに選択済みなら無視
      optionSelected = true;

      const result = applyOption(option, playerData.stats);
      displayResult(result);
      updateStatusPanel(playerData);
      playerData.age = (playerData.age ?? 0) + 1;

      const id = localStorage.getItem("currentUser");
      await savePlayerData(id, playerData);
      //await set(ref(window.db, `characters/${id}`), playerData);
      //savePlayerData(playerData.id, playerData);

      // 全ボタンを無効化
      Array.from(optionsDiv.children).forEach(btn => btn.disabled = true);

      document.getElementById("next-button").style.display = "block";
      document.getElementById("next-button").onclick = onComplete;
    };
    optionsDiv.appendChild(button);
  });
}

function displayResult(result) {
  const logDiv = document.getElementById("result-log");
  logDiv.innerHTML = `
    <p>${result.message}</p>
    <ul>
      ${Object.entries(result.effects).map(([key, value]) => `<li>${key}: ${value > 0 ? "+" : ""}${value}</li>`).join("")}
    </ul>
    <p>${result.text}</p>
  `;
  document.getElementById("next-button").style.display = "block";
}

function isEventAvailable(event, player) {
  if (!event.condition) return true;
  for (let key in event.condition) {
    if (player.affiliation !== event.condition[key]) {
    //if (player.affiliations !== event.condition[key]) {
      return false;
    }
  }
  return true;
}

function showWaitMessage() {
  document.getElementById("event-title").textContent = "次のイベントまでお待ちください…🌙";
  document.getElementById("event-description").textContent = "";
  document.getElementById("options").innerHTML = "";
  document.getElementById("result-log").innerHTML = "";
  document.getElementById("next-button").style.display = "none"; // ← これを追加！
}

//実行可能なイベントを一つ抽出
function getNextEvent(events, playerData) {
  const localYear = playerData.age ?? 0;
  //const localYear = playerData.localYear ?? 0;
  const nextEvent = events.find(event =>
    Array.isArray(event.year) &&
    event.year.includes(localYear) &&
    isEventAvailable(event, playerData)
  );
  //console.log("nextEvent:", nextEvent);
  return nextEvent;
}

//イベントファイルを年齢で選び分ける
function getEventFileByAge(age) {
  //console.log("age: ", age);
  if (age < 6) return "data/events/events_baby.json";
  if (age < 12) return "data/events/events_elementary.json";
  if (age < 15) return "data/events/events_junior.json";
  if (age < 18) return "data/events/events_high.json";
  if (age < 22) return "data/events/events_univ.json";
  if (age < 30) return "data/events/events_22to29.json";
  if (age < 40) return "data/events/events_30to39.json";
  if( age < 50) return "data/events/events_40to49.json";
  if( age < 60) return "data/events/events_50to59.json";
  if( age < 70) return "data/events/events_60to69.json";
  if( age < 80) return "data/events/events_70to79.json";
  return "data/events/events_80to89.json";
}

//エンディング条件判定
function isEnding(playerData) {
    //プレイヤーの参加回が現在サイクルの2つ以上前なら終了処理へ
  const result =  (playerData.joinedCycle < calculateCycleNumber() - 1) ||
    //プレイヤーのlocalYearがMaxYearなら終了処理へ
         (playerData.age > gameConfig.endAge);
         //(playerData.localYear > gameConfig.endAge);
  return result;
}

//待機条件判定
function isWaiting(playerData) {
  const result = (playerData.joinedCycle === calculateCycleNumber())
    && (playerData.age - gameConfig.startAge >= get_yearInCycle());
    //&& (playerData.localYear - gameConfig.startAge >= get_yearInCycle());
  return result;
}

//1イベント実行，イベントファイル選び分け対応
function doSingleEvent(playerData) {
  const eventFile = getEventFileByAge(playerData.age);
  //const eventFile = getEventFileByAge(playerData.localYear);
  console.log("yearInCycle: ", get_yearInCycle())
  fetch(eventFile)
    .then(response => response.json())
    .then(events => {
      
      updateCycleTimeDisplay();
      updateStatusPanel(playerData);

      // 終了条件判定
      if (isEnding(playerData)){
        window.location.href = "ending.html";
        return;
      }

      //待機条件判定
      const nextEvent = getNextEvent(events, playerData);
      if (!nextEvent || isWaiting(playerData)) {
        showWaitMessage();
        document.getElementById("refresh-button").style.display = "block";
        return;
      }
      
      document.getElementById("refresh-button").style.display = "none";
      document.getElementById("next-button").style.display = "none";
      console.log("playerData.stats:", playerData.stats);
      displayEvent(nextEvent, playerData, () => {

        // 次のイベントへ（リロードせず再帰呼び出し）
        doSingleEvent(playerData);
      });
    });
}

//20251009 playerDataをFirebaseから読み込む
async function loadPlayerDataFromFirebase(id) {
  const snapshot = await get(ref(window.db, `characters/${id}`));
  return snapshot.exists() ? snapshot.val() : null;
}

//20251009 firebase対応
// ゲーム開始処理
window.onload = async () => {
  const id = localStorage.getItem("currentUser");
  const playerData = await loadPlayerDataFromFirebase(id);
  //const playerData = loadPlayerData(id);
  
  //ログイン情報がないなら
  if (!playerData || !id) {
    alert("キャラクターが登録されていません。キャラクター登録ページへ移動します。");
    window.location.href = "register.html";
    return;
  }
  
  console.log("id:", id);
  console.log("playerData:", playerData);
  console.log("joinedCycle:", playerData.joinedCycle);

  playerData.age = playerData.age ?? 0;
  //playerData.localYear = playerData.localYear ?? 0;

  document.getElementById("event-container").style.display = "block";
  document.getElementById("current-cycle-time").style.display = "block";
  document.getElementById("status-panel").style.display = "block";

  doSingleEvent(playerData);

  // 更新ボタンのイベント追加
  const refreshBtn = document.getElementById("refresh-button");
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      // 再度条件判定して、待機解除ならイベント進行
      const latestYearInCycle = get_yearInCycle();
      const beforeCycle = (playerData.joinedCycle === calculateCycleNumber() - 1);
      const shouldInCurrentCycle = (playerData.joinedCycle === calculateCycleNumber())
        && (playerData.age - gameConfig.startAge < latestYearInCycle);
        //&& (playerData.localYear - gameConfig.startAge < latestYearInCycle);

      if (beforeCycle || shouldInCurrentCycle) {
        doSingleEvent(playerData);
      }
    };
  }
}
