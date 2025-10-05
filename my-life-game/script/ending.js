window.onload = () => {
  const id = localStorage.getItem("currentUser");
  const data = loadPlayerData(id);

  if (!data || !id) {
    document.getElementById("ending-title").textContent = "プレイヤーデータが見つかりません";
    return;
  }

  if (!data.ended){
    const cycle = data.joinedCycle;
    const rankingKey = `ranking_candidates_cycle_${cycle}`;
    const candidates = JSON.parse(localStorage.getItem(rankingKey)) || [];
    
    candidates.push({
      id: data.id,
      name: data.name,
      points: data.stats.points,
      cycle: cycle
    });
    
    localStorage.setItem(rankingKey, JSON.stringify(candidates));
    
    data.ended = true;
    savePlayerData(id, data); // 保存関数がある前提
  }

  const summary = `
    <strong>獲得ポイント：${data.stats.points}</strong><br>
    名前：${data.name}<br>
    年齢：${data.localYear}歳<br>
    所属：${data.affiliations}<br>
    体力：${data.stats.stamina}<br>
    知力：${data.stats.intelligence}<br>
    センス：${data.stats.sense}<br>
    エロさ：${data.stats.eros}<br>
    所持金：${data.stats.money}万円<br>
    あなたは第${data.joinedCycle}回の物語を生き抜きました。
  `;

  document.getElementById("summary-log").innerHTML = summary;
  
};
