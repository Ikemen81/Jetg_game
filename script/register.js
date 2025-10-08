function randomStat(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function registerPlayer() {
  const name = document.getElementById("player-name").value.trim() || "名無し";
  const id = localStorage.getItem("currentUser");
  if (!id) {
    alert("ログインしてから登録してください");
    return;
  }
  
  const playerKey = `player_${id}`;

  const playerData = {
    id: id,
    name: name,
    joinedCycle: calculateCycleNumber(),
    localYear: gameConfig.startAge,
    stats: {
      stamina: randomStat(0, 10),
      intelligence: randomStat(0, 10),
      sense: randomStat(0, 10),
      eros: randomStat(0, 10),
      money: randomStat(0, 10),
      points: 0
    },
    affiliations: gameConfig.startAffil
  };

  localStorage.setItem(playerKey, JSON.stringify(playerData));
  window.location.href = "game.html";
}

document.getElementById("player-register-form").onsubmit = function(e) {
  e.preventDefault();
  registerPlayer();
};

