window.onload = async () => {
  const id = localStorage.getItem("currentUser");
  const playerData = await loadPlayerDataFromFirebase(id);

  if (!playerData || !id) {
    document.getElementById("ending-title").textContent = "プレイヤーデータが見つかりません";
    return;
  }

  if (!playerData.ended){
    const cycle = playerData.joinedCycle;
    //const rankingKey = `ranking_candidates_cycle_${cycle}`;
    //const candidates = JSON.parse(localStorage.getItem(rankingKey)) || [];
    
    data = {
      //id: playerData.id,
      name: playerData.name,
      points: playerData.stats.points,
      age: playerData.age,
    };
    
    /*candidates.push({
      id: data.id,
      name: data.name,
      points: data.stats.points,
      cycle: cycle
    });*/
    
    await set(ref(window.db, `cycles/${cycle}/${id}`), data);
    //localStorage.setItem(rankingKey, JSON.stringify(candidates));
    
    playerData.ended = true;
    await savePlayerData(id, playerData); // 保存関数がある前提
  }

  const summary = `
    <strong>獲得ポイント：${playerData.stats.points}</strong><br>
    名前：${playerData.name}<br>
    年齢：${playerData.age}歳<br>
    所属：${playerData.affiliations}<br>
    体力：${playerData.stats.stamina}<br>
    知力：${playerData.stats.intelligence}<br>
    センス：${playerData.stats.sense}<br>
    エロさ：${playerData.stats.eros}<br>
    所持金：${playerData.stats.money}万円<br>
    あなたは第${playerData.joinedCycle}回の物語を生き抜きました。
  `;

  document.getElementById("summary-log").innerHTML = summary;
  
};
