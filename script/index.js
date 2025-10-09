window.onload = async function showCycleRanking() {
  const snapshot = await get(ref(window.db, "characters"));
  const cycle = calculateCycleNumber();
  const ranking = [];

  if (snapshot.exists()) {
    const characters = snapshot.val();

    Object.entries(characters).forEach(([username, pData]) => {
      if (pData.joinedCycle === cycle) {
        ranking.push({
          username,
          playerName: pData.name || "名無し",
          age: pData.age || 0,
          points: pData.stats?.points ?? 0
        });
      }
    });
  }

  ranking.sort((a, b) => b.points - a.points);

  const tbody = document.querySelector("#cycle-ranking tbody");
  tbody.innerHTML = "";
  
  if (ranking.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">該当データなし</td></tr>`;
    return;
  }

  ranking.slice(0, 5).forEach((r, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r.playerName}</td>
      <td>${r.age}</td>
      <td>${r.points}</td>
      <td>${r.username}</td>
    `;
    tbody.appendChild(tr);
  });
};