let playerData;

function calculateGlobalMonth() {
  const startTime = new Date("2025-09-05T00:00:00+09:00");
  const now = new Date();
  const diffMs = now - startTime;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  return diffMinutes;
}

function calculateCycleNumber() {
  const month = calculateGlobalMonth();
  return Math.floor(month / 1200) + 1;
}

function loadPlayerData(id) {
  const key = `player_${id}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function savePlayerData(id, player) {
  const key = `player_${id}`;
  localStorage.setItem(key, JSON.stringify(player));
}

function handleLogin() {
  const id = document.getElementById("login-id").value;
  const password = document.getElementById("login-password").value;

  if (!id || !password) {
    alert("IDとパスワードを入力してください");
    return;
  }

  const existing = loadPlayerData(id);

  if (existing) {
    if (existing.password === password) {
      playerData = existing;
      document.getElementById("login-form").style.display = "none";
      handleCycleStart();
    } else {
      alert("パスワードが違います");
    }
  } else {
    playerData = {
      id: id,
      password: password,
      name: "",
      joinedCycle: calculateCycleNumber(),
      stats: {
        stamina: 10,
        intelligence: 8,
        sense: 12,
        eros: 5,
        money: 3000,
        points: 0
      },
      affiliations: {},
      lastProcessedMonth: 0
    };
    savePlayerData(id, playerData);
    document.getElementById("login-form").style.display = "none";
    handleCycleStart();
  }
}

function handleCycleStart() {
  if (!playerData.name || playerData.name === "") {
    const name = prompt("今回のプレイヤー名を入力してください");
    playerData.name = name || "名無し";
    playerData.joinedCycle = calculateCycleNumber();
    playerData.lastProcessedMonth = 0;
    savePlayerData(playerData.id, playerData);
  }

  document.getElementById("event-container").style.display = "block";
  document.getElementById("current-cycle-time").style.display = "block";
  document.getElementById("status-panel").style.display = "block";

  startGameAfterLogin();
}

function updateCycleTimeDisplay() {
  const month = calculateGlobalMonth();
  const year = Math.floor(month / 12);
  const monthInYear = (month % 12) + 1;
  const cycle = calculateCycleNumber();

  document.getElementById("current-cycle-time").textContent =
    `第${cycle}回 ${year}年${monthInYear}月`;
}

function updateStatusPanel(stats) {
  const list = document.getElementById("status-list");
  list.innerHTML = Object.entries(stats)
    .map(([key, value]) => `<li>${key}: ${value}</li>`)
    .join("");
}

function startGameAfterLogin() {
  updateCycleTimeDisplay();
  updateStatusPanel(playerData.stats);

  fetch("events.json")
    .then(response => response.json())
    .then(events => {
      const currentMonth = calculateGlobalMonth();
      const pending = events.filter(event =>
        event.month > playerData.lastProcessedMonth &&
        event.month <= currentMonth &&
        isEventAvailable(event, playerData)
      );
      startEventSequence(pending, playerData.stats);
    });
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

  for (let stat in effects) {
    stats[stat] = (stats[stat] || 0) + effects[stat];
  }

  if (option.setAffiliation) {
    for (let key in option.setAffiliation) {
      playerData.affiliations[key] = option.setAffiliation[key];
    }
  }

  return {
    message: `「${option.text}」 → ${isSuccess ? "成功！" : "失敗…"}`,
    effects
  };
}

function displayEvent(event, stats, onComplete) {
  document.getElementById("event-title").textContent = event.title;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  document.getElementById("result-log").innerHTML = "";

  event.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = () => {
      const result = applyOption(option, stats);
      displayResult(result);
      updateStatusPanel(stats);
      setTimeout(onComplete, 1500);
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
  `;
}

function isEventAvailable(event, player) {
  if (!event.condition) return true;
  for (let key in event.condition) {
    if (player.affiliations[key] !== event.condition[key]) {
      return false;
    }
  }
  return true;
}

function startEventSequence(events, stats) {
  let index = 0;

  function next() {
    if (index >= events.length) {
      if (checkGameEnd(playerData)) {
        displayFinalEvent(playerData);
      } else {
        showWaitMessage();
      }
      return;
    }
    displayEvent(events[index], stats, () => {
      index++;
      playerData.lastProcessedMonth = events[index - 1].month;
      savePlayerData(playerData.id, playerData);
      next();
    });
  }

  next();
}

function showWaitMessage() {
  document.getElementById("event-title").textContent = "次のイベントまでお待ちください…🌙";
  document.getElementById("options").innerHTML = "";
  document.getElementById("result-log").innerHTML = "";
}

function checkGameEnd(player) {
  return player.lastProcessedMonth >= 1200;
}

function calculateAgeFromMonth(month) {
  return `${Math.floor(month / 12)}歳`;
}

function displayFinalEvent(player) {
  const container = document.getElementById("final-status");
  const summary = document.getElementById("status-summary");
  container.style.display = "block";

  const stats = player.stats;
  const affiliations = player.affiliations;

  summary.innerHTML = `
    <p><strong>名前：</strong> ${player.name || "名無し"}</p>
    <p><strong>年齢：</strong> ${calculateAgeFromMonth(player.lastProcessedMonth)}</p>
    <p><strong>職業：</strong> ${affiliations.job || "未定"}</p>
    <p><strong>ステータス：</strong></p>
    <ul>
      ${Object.entries(stats).map(([key, value]) => `<li>${key}: ${value}</li>`).join("")}
    </ul>
    <p><strong>所属：</strong></p>
    <ul>
      ${Object.entries(affiliations).map(([key, value]) => `<li>${key}: ${value}</li>`).join("")}
    </ul>
  `;
}

function promptRankingEntry(player) {
  document.getElementById("ranking-entry").style.display = "block";
}

function submitRanking() {
  const name = document.getElementById("player-name").value || "名無し";
  playerData.name = name;
  saveToRanking(playerData, name);
  document.getElementById("ranking-entry").style.display = "none";
  displayRanking();
}

function saveToRanking(player, name) {
  const cycle = calculateCycleNumber();
  const ranking = JSON.parse(localStorage.getItem(`ranking_cycle_${cycle}`)) || [];

  ranking.push({
    name: name,
    points: player.stats.points,
    job: player.affiliations.job || "未定",
    age: calculateAgeFromMonth(player.lastProcessedMonth)
  });

  ranking.sort((a, b) => b.points - a.points);
  localStorage.setItem(`ranking_cycle_${cycle}`, JSON.stringify(ranking));
}

function displayRanking() {
  const cycle = calculateCycleNumber();
  const ranking = JSON.parse(localStorage.getItem(`ranking_cycle_${cycle}`)) || [];
  const container = document.getElementById("ranking-container");

  container.innerHTML = `<h2>第${cycle}回 ランキング</h2><ol>` +
    ranking.map(entry =>
      `<li>${entry.name}（${entry.age}・${entry.job}）：${entry.points}pt</li>`
    ).join("") +
    `</ol>`;
}
