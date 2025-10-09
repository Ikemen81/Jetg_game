function randomStat(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function registerPlayer() {
  const name = document.getElementById("player-name").value.trim() || "名無し";
  const username = localStorage.getItem("currentUser");
  //const id = localStorage.getItem("currentUser");
  if (!username) {
  //if (!id) {
    alert("ログインしてから登録してください");
    return;
  }
  
  //const playerKey = `player_${id}`;

  const characterData = {
    //id: id,
    name: name,
    joinedCycle: calculateCycleNumber(),
    age: gameConfig.startAge,
    stats: {
      stamina: randomStat(0, 10),
      intelligence: randomStat(0, 10),
      sense: randomStat(0, 10),
      eros: randomStat(0, 10),
      money: randomStat(0, 10),
      points: 0
    },
    affiliation: gameConfig.startAffil
  };

  const charRef = ref(window.db, `characters/${username}`);

  try {
      await set(charRef, characterData);
      window.location.href = "game.html";
    } catch (error) {
      console.error("保存エラー:", error);
      alert("キャラクター登録に失敗しました");
    }

  //localStorage.setItem(playerKey, JSON.stringify(playerData));
  //window.location.href = "game.html";
}

document.getElementById("player-register-form").onsubmit = function(e) {
  e.preventDefault();
  registerPlayer();
};

