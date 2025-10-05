function getAvailableCycles() {
  const cycles = [];
  for (let i = 1; i <= calculateCycleNumber(); i++) {
    const key = `ranking_candidates_cycle_${i}`;
    if (localStorage.getItem(key)) {
      cycles.push(i);
    }
  }
  console.log("calculateCycleNumber: ", calculateCycleNumber())
  console.log("cycles: ", cycles)
  return cycles;
}

function displayRanking(cycle) {
  const rankingKey = `ranking_candidates_cycle_${cycle}`;
  const candidates = JSON.parse(localStorage.getItem(rankingKey)) || [];

  const title = document.getElementById("ranking-title");
  const list = document.getElementById("ranking-list");

  title.textContent = `第${cycle}回ランキング`;

  if (candidates.length === 0) {
    list.innerHTML = "<li>このサイクルにはランキング候補がいません。</li>";
    return;
  }

  candidates.sort((a, b) => b.points - a.points);

  list.innerHTML = candidates.map((player, index) => `
    <li><strong>${index + 1}位</strong>：${player.name}（${player.points}pt）</li>
  `).join("");
}

window.onload = () => {
  const select = document.getElementById("cycle-select");
  const cycles = getAvailableCycles();

  cycles.forEach(cycle => {
    const option = document.createElement("option");
    option.value = cycle;
    option.textContent = `第${cycle}回`;
    select.appendChild(option);
  });

  // 初期表示は最新サイクル
  const latest = cycles[cycles.length - 1];
  select.value = latest;
  displayRanking(latest);

  select.onchange = () => {
    const selectedCycle = parseInt(select.value);
    displayRanking(selectedCycle);
  };
};
