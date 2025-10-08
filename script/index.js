window.onload = function showCycleRanking() {
  const users = getUsers();
  const cycle = calculateCycleNumber();
  const ranking = [];

  users.forEach(u => {
    const pdata = loadPlayerData(u.username);
    if (pdata && pdata.joinedCycle === cycle) {
      ranking.push({
        username: u.username,
        playerName: pdata.name || "名無し",
        age: pdata.localYear || 0,
        points: pdata.stats?.points ?? 0
      });
    }
  });

  ranking.sort((a, b) => b.points - a.points);

  const tbody = document.querySelector("#cycle-ranking tbody");
  tbody.innerHTML = "";
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
  if (ranking.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">該当データなし</td></tr>`;
  }
};