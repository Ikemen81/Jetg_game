async function getAvailableCycles() {
  const cycles = [];
  for (let i = 1; i <= calculateCycleNumber(); i++) {
    const snapshot = await get(ref(window.db, `cycles/${i}`));
    //const key = `ranking_candidates_cycle_${i}`;
    if (snapshot.exists()) {
      cycles.push(i);
    }
    /*if (localStorage.getItem(key)) {
      cycles.push(i);
    }*/
  }
  console.log("calculateCycleNumber: ", calculateCycleNumber())
  //console.log("cycles: ", cycles)
  return cycles;
}

async function displayRanking(cycle) {
  //const rankingKey = `ranking_candidates_cycle_${cycle}`;
  //const candidates = JSON.parse(localStorage.getItem(rankingKey)) || [];

  const title = document.getElementById("ranking-title");
  const list = document.getElementById("ranking-list");

  title.textContent = `第${cycle}回ランキング`;

  const snapshot = await get(ref(window.db, `cycles/${cycle}`));
  if (!snapshot.exists()) {
    list.innerHTML = "<li>このサイクルにはランキング候補がいません。</li>";
    return;
  }
  /*if (candidates.length === 0) {
    list.innerHTML = "<li>このサイクルにはランキング候補がいません。</li>";
    return;
  }*/

  const candidates = Object.values(snapshot.val());
  candidates.sort((a, b) => b.points - a.points);

  list.innerHTML = candidates.map((player, index) => `
    <li><strong>${index + 1}位</strong>：${player.name}（${player.points}pt）</li>
  `).join("");
}

window.onload = async () => {
  console.log("calculateCycleNumber: ", calculateCycleNumber())
  const select = document.getElementById("cycle-select");
  const cycles = await getAvailableCycles();
  console.log("cycles: ", cycles);

  cycles.forEach(cycle => {
    const option = document.createElement("option");
    option.value = cycle;
    option.textContent = `第${cycle}回`;
    select.appendChild(option);
  });

  // 初期表示は最新サイクル
  const latest = cycles[cycles.length - 1];
  select.value = latest;
  await displayRanking(latest);

  select.onchange = () => {
    const selectedCycle = parseInt(select.value);
    displayRanking(selectedCycle);
  };
};
