
document.getElementById("login-form").onsubmit = async function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  if (!username || !password) {
    errorMsg.textContent = "ユーザー名とパスワードを入力してください。";
    return;
  }

  const userRef = ref(window.db, `users/${username}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    errorMsg.textContent = "ユーザーが存在しません。";
    return;
  }

  const userData = snapshot.val();
  if (userData.password !== password) {
    errorMsg.textContent = "ユーザー名またはパスワードが違います。";
    return;
  }

  //const users = getUsers();
  //const user = users.find(u => u.username === username && u.password === password);

  /*if (!user) {
    errorMsg.textContent = "ユーザー名またはパスワードが違います。";
    return;
  }*/

  // ログイン成功時の処理（例: ユーザー名を保存してゲーム画面へ）
  localStorage.setItem("currentUser", username);
  window.location.href = "game.html";
};
